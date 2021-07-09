/* src/App.js */
import React, { CSSProperties, useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createWord } from './graphql/mutations'
import { listWords } from './graphql/queries'

import { RekognitionClient, DetectLabelsCommand } from '@aws-sdk/client-rekognition'

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const client = new RekognitionClient({
  region : 'us-west-2',
  credentials: {
    accessKeyId: 'AKIA25VFNGRYHRFTGYOS',//process.env.REACT_APP_AWS_ACCESS_KEY as string,
    secretAccessKey: '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'//process.env.REACT_APP_AWS_SECRET_ACCESS_KEY as string
  }
})

const initialState = {name: ''}

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [words, setWords] = useState(new Array<Word>())
  const [imageUrls, setImageUrls] = useState(new Array<string>())
  const [associations, setAssociations] = useState(new Array<[string, number]>())

  useEffect(() => {
    fetchWords()
  }, [])

  function setInput(key: string, value: string) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchWords() {
    try {
      const wordData = await API.graphql(graphqlOperation(listWords)) as {data: {listWords: {items: Word[]}}}
      const words = wordData.data.listWords.items
      setWords(words)
    } catch (err) { console.log('error fetching words') }
  }

  async function addWord() {
    try {
      if (!formState.name) return
      const word = { ...formState }
      setWords([...words, word])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createWord, {input: word}))
    } catch (err) {
      console.log('error creating word:', err)
    }
  }

  /**Returns an array containing an array of image bytes for each word.
   * The number of images for each word is determined by 'pageSize.'
  */
  const getImageBytes = async () => {
    //fetch an array containing lists, one for each word, of Google image urls
    const urlLists = words.map(async word => {
      let url = (process.env.NODE_ENV === 'development' //for end-to-end testing in dev mode
        ? `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?`
        : '/testGoogleImageApi?'
      )
      const searchParams = new URLSearchParams(
        [['q', word.name], ['pageNumber', 1], ['pageSize', 10], ['autoCorrect', false]] as string[][]
      )
      url += searchParams.toString()

      const fetchConfig = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY!,
          'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_HOST!
        }
      }
      
      const res = await fetch(url, fetchConfig)
      const data = await res.json() as {value: {url: string}[]} //fetch returns an array of objs with urls
      const urls = data.value.flatMap(img => (
        img.url.startsWith('https') ? [img.url] : []
      )) //take just the urls hosted on https

      setImageUrls(urls)

      return urls
    })

    //fetch image urls and convert each to an Uint8Array for Rekognition to use
    const uInt8ArrayBytesList = (await Promise.all(urlLists)).map(async urlList => {
      const uInt8ArrayBytes = urlList.map(async url => {
        const res = await fetch(url)
        const imageBytes = await res.arrayBuffer()
        const ua = new Uint8Array(imageBytes)

        return ua
      })

      return await Promise.all(uInt8ArrayBytes)
    })

      return await Promise.all(uInt8ArrayBytesList)
  }

  /**Passes images to Rekognition for label detection. A label is
   * something Rekognition sees in an image: E.g., a person or a window.
   */
  const analyzeImages = (imageBytesLists: Uint8Array[][], labelsToReturn: number) => {
    //list containing sets of labels from images for each word
    const listOfLabelLists = imageBytesLists.map(imageByteList => {
      const wordLabels = new Set<string>()

      imageByteList.forEach(async bytes => {//call Rekognition for labels
        const rekognitionCommand = new DetectLabelsCommand(
          {
            Image: {Bytes: bytes}
          }
        )
        const rekognitionResponse = await client.send(rekognitionCommand)

        rekognitionResponse.Labels?.forEach(label => {
          label.Name && wordLabels.add(label.Name)
        })
      })

      return wordLabels
    })

    //common labels between label lists
    const commonLabels = new Map<string, number>()

    listOfLabelLists.forEach(labelList => {//ERR: Not read?
      labelList.forEach(wordLabel => {//increments count of wordLabel in commonLabels or initializes it to 1
        const labelCount = (commonLabels.has(wordLabel) 
          ? commonLabels.get(wordLabel)! + 1
          : 1
        )
        commonLabels.set(wordLabel, labelCount)
      })
    })

    //sort common labels by occurences
    const sortedLabels = [...commonLabels.entries()].sort((a, b) => a[1] - b[1])

    //return labelsToReturn labels or all labels if there are fewer than labelsToReturn
    const returnLength = (sortedLabels.length >= labelsToReturn 
      ? labelsToReturn 
      : sortedLabels.length
    )
    setAssociations(sortedLabels.slice(0, returnLength))
  }

  const getAssociations = async () => {
    const imageBytes = await getImageBytes()

    analyzeImages(imageBytes, 5)
  }

  return (
    <div style={styles.container as CSSProperties}>
      <h2>Word list</h2>
      <input
        onChange={event => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder='Name'
      />
      <button style={styles.button} onClick={addWord}>Create Word</button>
      {
        words.map((word, index) => (
          <div key={word.id ?? index} style={styles.word}>
            <p style={styles.wordName as CSSProperties}>{word.name}</p>
          </div>
        ))
      }
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
      {
        imageUrls.map((imageUrl, index) => (
          <img key={index} src={imageUrl}/>
        ))
      }
    </div>
  )
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  word: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  wordName: { fontSize: 20, fontWeight: 'bold' },
  wordDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default App