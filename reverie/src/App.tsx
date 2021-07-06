/* src/App.js */
import React, { CSSProperties, useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createWord } from './graphql/mutations'
import { listWords } from './graphql/queries'

import awsExports from "./aws-exports";
import { stringify } from 'querystring';
Amplify.configure(awsExports);

const initialState = {name: ''}

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [words, setWords] = useState<Word[]>([])
  const [associations, setAssociations] = useState([])
  const [imgUrls, setImgUrls] = useState([])

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

  async function getImageUrls() {
    const urls = words.map(async word => {
      const url = new URL(`https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI`)
      const searchParams = new URLSearchParams(
        [['q', word.name], ['pageNumber', 1], ['pageSize', 10], ['autoCorrect', false]] as string[][]
      )
      url.search = searchParams.toString()

      const fetchConfig = {
        "method": "GET",
        "headers": {
          "x-rapidapi-key": "e9d24164f4msh7c129df4ebbe15dp141c4cjsn05d5e1ca14eb",
          "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com"
        }
      }

      const res = await fetch(url.href, fetchConfig)
      const data: {value: {url: string}[]} = await res.json()
      const urlArray = data.value.map(img => img.url)
      return urlArray
    })

    setImgUrls(urls)
  }

  async function analyzeImages() {
    const imageUrls = await getImageUrls()

    
  }

  return (
    <div style={styles.container as CSSProperties}>
      <h2>Word list</h2>
      <input
        onChange={event => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <button style={styles.button} onClick={addWord}>Create Word</button>
      {
        words.map((word, index) => (
          <div key={word.id ? word.id : index} style={styles.word}>
            <p style={styles.wordName as CSSProperties}>{word.name}</p>
          </div>
        ))
      }
      {
        //getImageUrls().map(url => )
      }
      <button onClick={getImageUrls}>Get images</button>
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