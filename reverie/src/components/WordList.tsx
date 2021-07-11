import React, {useState, useEffect} from 'react'
import {createWord, listWords} from '../graphql'
import Amplify, { API, graphqlOperation } from 'aws-amplify'

import awsExports from '../aws-exports';
Amplify.configure(awsExports);

const initialState = {name: ''}

export const WordList = ({setActiveWords}
  : {setActiveWords: React.Dispatch<React.SetStateAction<Word[]>>}
) => {
  const [formState, setFormState] = useState(initialState)
  const [words, setWords] = useState(new Array<Word>())

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
      setActiveWords(words)
    } catch (err) { console.log('error fetching words') }
  }

  async function addWord() {
    try {
      if (!formState.name) return
      const word = { ...formState }
      setActiveWords([...words, word])
      setWords([...words, word])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createWord, {input: word}))
    } catch (err) {
      console.log('error creating word:', err)
    }
  }

  return (
    <>
      <h2>Word list</h2>
      <input
        onChange={event => setInput('name', event.target.value)}
        value={formState.name}
        placeholder='Name'
      />
      <button onClick={addWord}>Create Word</button>
      {
        words.map((word, index) => (
          <div key={word.id ?? index}>
            <p>{word.name}</p>
          </div>
        ))
      }
    </>
  )
}
