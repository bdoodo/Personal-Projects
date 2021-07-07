/* src/App.js */
import React, { CSSProperties, useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createWord } from './graphql/mutations'
import { listWords } from './graphql/queries'

import { RekognitionClient, DetectLabelsCommand } from '@aws-sdk/client-rekognition'

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const client = new RekognitionClient({})

const initialState = {name: ''}

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [words, setWords] = useState(new Array<Word>())
  const [associations, setAssociations] = useState([])

  useEffect(() => {
    fetchWords()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchWords() {
    try {
      const wordData = await API.graphql(graphqlOperation(listWords)) as {data}
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

  /**For each word in words, this function gets Google images with it 
   * as a query, then fetches these images and converts them to bytes 
   * (uInt8Arrays) for Amazon Rekognition to use. These bytes are stored
   * in an array, so that each word has an array of bytes, then these arrays
   * are in turn returned in an array.
   */
  const getImageBytes = async () => {
    const urls = words.map(async word => {

      //fetch an array containing Google image urls
      const url = new URL(`https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI`)
      const searchParams = new URLSearchParams(
        [['q', word.name], ['pageNumber', 1], ['pageSize', 10], ['autoCorrect', false]] as string[][]
      )
      url.search = searchParams.toString()

      const fetchConfig = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
          'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_HOST
        }
      }

      const res = await fetch(url.href, fetchConfig)
      const data = await res.json() as {value: {url: string}[]} //an array of objs with urls
      const urlArray = data.value.map(img => img.url) //take just the urls
      const httpsUrls = urlArray.filter(url => url.startsWith('https')) //Only accept image urls hosted on https

      //fetch image urls and convert each to an Uint8Array for Rekognition to use
      const uInt8ArrayUrls = httpsUrls.map(async url => {
        const res = await fetch(url)
        const imageBytes = await res.arrayBuffer()
        const ua = new Uint8Array(imageBytes)

        return ua
      })

      return Promise.all(uInt8ArrayUrls)
    })

    return await Promise.all(urls)
  }

  /**Passes images to Rekognition for label detection */
  const analyzeImages = async () => {
    const imageBytes = await getImageBytes()

    let allLabels = new Array<Set<string>>()

    //With Rekognition, get all labels from images
    imageBytes.forEach(listOfBytes => {
      const wordLabels = new Set<string>()

      listOfBytes.forEach(async bytes => {
        const command = new DetectLabelsCommand(
          {
            Image: {Bytes: bytes}
          }
        )
        const response = await client.send(command)

        response.Labels?.forEach(label => {
          wordLabels.add(label.Name)
        })
      })

      allLabels.push(wordLabels)
    })

    //group common labels between words
    const commonLabels = new Map<string, number>()

    allLabels.forEach(wordLabelsList => {
      wordLabelsList.forEach(wordLabel => {//increments count of wordLabel in commonLabels or initializes it to 1
        const labelCount = commonLabels.has(wordLabel) ? commonLabels.get(wordLabel) + 1
          : 1
        commonLabels.set(wordLabel, labelCount)
      })
    })

    //sort common labels by occurences
    const sortedLabels = [...commonLabels.entries()].sort((a, b) => a[1] - b[1])

    return sortedLabels
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
          <div key={word.id ? word.id : index} style={styles.word}>
            <p style={styles.wordName as CSSProperties}>{word.name}</p>
          </div>
        ))
      }
      <button onClick={()=>{}}>Get images</button>
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