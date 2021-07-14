//set up Rekognition
import {
  RekognitionClient,
  DetectLabelsCommand,
} from '@aws-sdk/client-rekognition'
const client = new RekognitionClient({
  region: 'us-west-2',
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY!,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY!,
  },
})

/**
 * Fetches urls of images for each word to be processed later.
 *
 * @param words Array of words to fetch urls for
 * @returns A promise for an array of url arrays, one for each word
 */
export const fetchUrlLists = async (words: Word[]) => {
  //for each word, fetch a list of image urls and store it in an array (urlLists)
  const urlLists: Promise<WordImages>[] = words.map(async word => {
    let url =
      `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?` +
      new URLSearchParams([
        ['q', word.name],
        ['pageNumber', 1],
        ['pageSize', 50],
        ['autoCorrect', false],
        ['safeSearch', true],
      ] as string[][]).toString()

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY!,
        'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_HOST!,
      },
    })
    const data = (await res.json()) as { value: { url: string }[] }
    const urls = data.value.flatMap(
      (
        img //take just the urls hosted on https
      ) => (img.url.startsWith('https') ? [img.url] : [])
    )

    const wordImages = {
      word: word,
      images: urls.map(url => ({ url: url })),
    } as WordImages

    return wordImages
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
export const imagesToBytes = async (
  wordImagesList: WordImages[]
): Promise<WordImages[]> => {
  //fetch image urls and convert each to an Uint8Array for Rekognition to use
  const updatedWordImages = wordImagesList.map(async wordImages => {
    const imageBytes = wordImages.images.map(async image => {
      try {
        const res = await fetch(image.url!)
        const bytes = await res.arrayBuffer()
        const ua = new Uint8Array(bytes)

        return ua
      } catch (error) {
        console.log('error fetching image', error)
        return null
      }
    })
    const resolvedImageBytes = await Promise.all(imageBytes)

    //If bytes exist for an image, append it
    resolvedImageBytes.forEach((bytes, index) => {
      if (bytes) {
        wordImages.images[index].bytes = bytes
      }
    })

    return wordImages
  })

  return await Promise.all(updatedWordImages)
}

/**Passes images to Rekognition for label detection. A label is
 * something Rekognition sees in an image: e.g., a person or a window.
 * Then modifies the input WordImages[] in place to add labels data to each image object,
 * and an allLabels property to each WordImages object.
 *
 * @param imageBytesLists A WordImages[] with image bytes data to analyze
 * @returns The modified WordImages array
 */
export const analyzeImages = async (wordImagesList: WordImages[]) => {
  const updatedWordImagesList = wordImagesList.map(async wordImages => {
    const WordImagesLabels = wordImages.images.map(async image => {
      try {
        //call Rekognition for labels
        const rekognitionCommand = new DetectLabelsCommand({
          Image: { Bytes: image.bytes },
        })
        const rekognitionResponse = await client.send(rekognitionCommand)
        const imageLabels = rekognitionResponse.Labels?.flatMap(label =>
          label.Name ? [label.Name] : []
        )

        return imageLabels
      } catch (error) {
        console.log('error analyzing image')
        return
      }
    })
    const resolvedImagesLabelList = await Promise.all(WordImagesLabels)

    //modify wordImages in place to append labels to each image if they exist
    resolvedImagesLabelList.forEach((labelList, index) => {
      if (labelList) {
        wordImages.images[index].labels = labelList
      }
    })

    //make a set for each word of all its labels and add it to wordImages's allLabels property
    const wordLabelsSet = new Set<string>()

    wordImages.images.forEach(image => {
      image.labels?.forEach(label => {
        wordLabelsSet.add(label)
      })
    })
    wordImages.allLabels = [...wordLabelsSet]

    return wordImages
  })

  return await Promise.all(updatedWordImagesList)
}

/**
 * Extracts labels from a WordImages[] to find labels shared between all words.
 * Sorts these labels by most to least shared and returns them in Association objects.
 *
 * @param wordImagesList An array of WordImages to pull labels from and sort
 * @param labelsToReturn The number of common labels (labels shared between words) to return
 * @returns An array of Association objects (containing labels and their occurrences between words)
 */
export const sortLabels = (
  wordImagesList: WordImages[],
  labelsToReturn: number
) => {
  //count how many words a label appears across
  const countedLabels = new Map<string, number>()

  wordImagesList.forEach(wordImages => {
    wordImages.allLabels?.forEach(label => {
      //initializes count to 1 if not counted yet, or adds to count
      const labelCount = countedLabels.has(label)
        ? countedLabels.get(label)! + 1
        : 1
      countedLabels.set(label, labelCount)
    })
  })

  //sort common labels by occurrences: greatest first
  const sortedLabels = [...countedLabels.entries()].sort((a, b) => b[1] - a[1])

  //return labelsToReturn labels or all labels if there are fewer than labelsToReturn
  const returnLength =
    sortedLabels.length >= labelsToReturn ? labelsToReturn : sortedLabels.length

  const trimmedLabels = sortedLabels.slice(0, returnLength)

  return trimmedLabels.map(label => ({
    name: label[0],
    occurrences: label[1],
  })) as Association[]
}

/**
 * Shuffles an array in place.
 * Taken from Richard Durstenfield's implementation of the Fisher-Yates shuffle:
 * https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html
 *
 * @param array The array to be shuffled
 */
export const shuffle = (array: any[]) => {
  let currentIndex = array.length
  while (currentIndex) {
    const randomIndex = Math.floor(Math.random() * currentIndex--)
    const temp = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temp
  }
  return array
}
