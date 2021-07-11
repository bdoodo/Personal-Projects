/* src/App.js */
import React, { useState } from 'react'
import { ImageGrid, WordList, Associations } from './components'

//set up Rekognition
import { RekognitionClient, DetectLabelsCommand } from '@aws-sdk/client-rekognition'
const client = new RekognitionClient({
  region : 'us-west-2',
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY!,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY!
  }
})


export const App = () => {
  const [imageUrls, setImageUrls] = useState(new Array<string>())
  const [associations, setAssociations] = useState(new Array<[string, number]>())
  const [activeWords, setActiveWords] = useState(new Array<Word>())

  
  const getAssociations = async () => {
    const imgUrlLists = await fetchUrlLists(activeWords)
    setImageUrls(imgUrlLists.flat())

    const imgBytesLists = await imagesToBytes(imgUrlLists)
    const labels = await analyzeImages(imgBytesLists)
    const sortedLabels = sortLabels(labels, 10)

    setAssociations(sortedLabels)
  }

  return (
    <div>
      <WordList setActiveWords={setActiveWords} />
      <button onClick={getAssociations}>Get images</button>
      <h2>Associations between words</h2>
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>Occurrences</th>
          </tr>
        </thead>
        <tbody>
        {
          associations.map((association, index) => (
            <tr key={index}>
              <td>{association[0]}</td>
              <td>{association[1]}</td>
            </tr>
          ))
        }
        </tbody>
      </table>
      <ImageGrid imgUrls={imageUrls} />
    </div>
  )
}

/**
 * Fetches urls of images for each word to be processed later.
 * 
 * @param words Array of words to fetch urls for
 * @returns A promise for an array of url arrays, one for each word
 */
const fetchUrlLists = async (words: Word[]) => {
  //for each word, fetch a list of image urls and store it in an array (urlLists)
  const urlLists = words.map(async word => {
    let url = `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?`
      + new URLSearchParams(
        [
          ['q', word.name], 
          ['pageNumber', 1], 
          ['pageSize', 50], 
          ['autoCorrect', false],
          ['safeSearch', true]
        ] as string[][]
      ).toString()
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY!,
        'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_HOST!
      }
    })
    const data = await res.json() as {value: {url: string}[]}
    const urls = data.value.flatMap(img => (//take just the urls hosted on https
      img.url.startsWith('https') ? [img.url] : []
    ))

    return urls
  })

  return await Promise.all(urlLists)
}
  
/**
 * Converts each url in a list of image-url-arrays to bytes (Uint8Arrays). This 
 * prepares the images to be processed by Amazon Rekognition.
 * 
 * @param urlLists The result from fetchUrlLists(): a promise for an array of url arrays
 * @returns A promise of bytes in the same shape as the input.
 */
const imagesToBytes = async (urlLists: string[][]) => {
  //fetch image urls and convert each to an Uint8Array for Rekognition to use
  const uInt8ArrayBytesList = urlLists.map(async urlList => {
    let uInt8ArrayBytes = urlList.map(async url => {
      try {
        const res = await fetch(url)
        const imageBytes = await res.arrayBuffer()
        const ua = new Uint8Array(imageBytes)

        return [ua] //returned in an array to be flattened in the next step
      } catch (error) {
        console.log('error fetching image', error)
        return []
      }
    })
    const filteredUInt8ArrayBytes = (await Promise.all(uInt8ArrayBytes)).flat()

    return filteredUInt8ArrayBytes
  })

  return await Promise.all(uInt8ArrayBytesList)
}


/**Passes images to Rekognition for label detection. A label is
 * something Rekognition sees in an image: E.g., a person or a window.
 * 
 * @param imageBytesLists An array containing arrays of image bytes to analyze
 * @returns An array of common labels, sorted from most to least shared
 */
const analyzeImages = async (imageBytesLists: Uint8Array[][]) => {
  const wordLabelLists = imageBytesLists.map(async imageByteList => {
    const wordLabelList = imageByteList.map(async imageBytes => {//call Rekognition for labels
      const rekognitionCommand = new DetectLabelsCommand({Image: {Bytes: imageBytes}})

      try {
        const rekognitionResponse = await client.send(rekognitionCommand)

        const imageLabels = rekognitionResponse.Labels?.flatMap(label => (
          label.Name ? [label.Name] : []
        ))

        return imageLabels ? [imageLabels] : []
      } catch (error) {
        console.log('error analyzing image', error)
        return []
      }
    })
    const filteredWordLabelList = (await Promise.all(wordLabelList)).flat()

    //make a set of labels for each word (no label duplicates per word)
    const uniqueWordLabelList = new Set<string>()

    filteredWordLabelList.forEach(imageLabelList => {
      imageLabelList.forEach(label => {
        uniqueWordLabelList.add(label)
      })
    })

    return uniqueWordLabelList
  })

  return await Promise.all(wordLabelLists)
}

/**
 * Filters an array of sets of labels to only include labels shared between all words, 
 * 
 * @param wordLabelLists An array of sets of labels
 * @param labelsToReturn The number of common labels (labels shared between words) to return
 * @returns An array of labels sorted by how many words share them
 */
const sortLabels = (wordLabelLists: Set<string>[], labelsToReturn: number) => {
  //common labels between label lists
  const countedLabels = new Map<string, number>()

  wordLabelLists.forEach(labelList => {
    labelList.forEach(wordLabel => {//increments count of wordLabel in commonLabels or initializes it to 1
      const labelCount = (countedLabels.has(wordLabel) 
        ? countedLabels.get(wordLabel)! + 1
        : 1
      )
      countedLabels.set(wordLabel, labelCount)
    })
  })

  //sort common labels by occurences: greatest first
  const sortedLabels = [...countedLabels.entries()].sort((a, b) => b[1] - a[1])

  //return labelsToReturn labels or all labels if there are fewer than labelsToReturn
  const returnLength = sortedLabels.length >= labelsToReturn 
    ? labelsToReturn 
    : sortedLabels.length
  
  return sortedLabels.slice(0, returnLength)
}