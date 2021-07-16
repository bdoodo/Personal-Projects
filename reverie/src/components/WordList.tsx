import React, { useState, useEffect } from 'react'
import { createWord, listWords, deleteWord } from '../graphql'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import {
  List,
  IconButton,
  makeStyles,
  Container,
  TextField,
  Button,
  Paper,
} from '@material-ui/core'
import { Add } from '@material-ui/icons'
import {
  analyzeImages,
  fetchUrlLists,
  imagesToBytes,
  sortLabels,
} from '../utils'
import { WordListItem } from './'

import awsExports from '../aws-exports'
Amplify.configure(awsExports)

export const WordList = ({
  filters: { filters, setFilters },
  wordImages: { wordImages, setWordImages },
  setAssociations,
  setProcessing,
}: {
  filters: FiltersState
  wordImages: {
    wordImages: WordImages[]
    setWordImages: React.Dispatch<React.SetStateAction<WordImages[]>>
  }

  setAssociations: React.Dispatch<React.SetStateAction<Association[]>>
  setProcessing: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [formState, setFormState] = useState({ name: '' })
  const [selected, setSelected] = useState(new Array<string>())

  const [activeWords, setActiveWords] = useState(new Array<Word>())
  const [inactiveWords, setInactiveWords] = useState(new Array<Word>())

  useEffect(() => {
    fetchWords()
  }, [])

  const setInput = (value: string) => {
    setFormState({ name: value })
  }

  const fetchWords = async () => {
    try {
      const wordData = (await API.graphql(graphqlOperation(listWords))) as {
        data: { listWords: { items: Word[] } }
      }
      const activeWords = wordData.data.listWords.items
      setActiveWords(activeWords)
    } catch (err) {
      console.log('error fetching words')
    }
  }

  const addWord = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      if (!formState.name) return
      const word = { ...formState }
      setInactiveWords([...inactiveWords, word])
      setFormState({ name: '' })
      await API.graphql(graphqlOperation(createWord, { input: word }))
    } catch (err) {
      console.log('error creating word:', err)
    }
  }

  //TODO: fix this
  const filterByWord = (word: string) => {
    //If the clicked word is already in 'filters,' remove it from filters; otherwise, add it.
    if (filters.words.includes(word)) {
      const tempWords = filters.words
      tempWords.splice(tempWords.indexOf(word), 1)
      setFilters({ ...filters, words: tempWords })
    } else {
      setFilters({ ...filters, words: [...filters.words, word] })
    }
  }

  const removeWord = async (word: string) => {
    //Find whether the word to be removed is in activeWords or inactiveWords
    const partOfActiveWords = activeWords.find(({ name }) => name === word)
    try {
      //If the deleted word was in filters, pass it to filterByWord to remove it
      filters.words.includes(word) && filterByWord(word)
      partOfActiveWords &&
        setActiveWords(activeWords.filter(({ name }) => name !== word))
      !partOfActiveWords &&
        setInactiveWords(inactiveWords.filter(({ name }) => name !== word))
      setWordImages(wordImages.filter(({ word: { name } }) => name !== word))
      await API.graphql(graphqlOperation(deleteWord, { input: { name: word } }))
    } catch (err) {
      console.log('error deleting word:', err)
    }
  }

  const getAssociations = async () => {
    setProcessing(true)

    const imgUrlLists = await fetchUrlLists(inactiveWords)
    console.log('after urls:', imgUrlLists)
    const imgBytesLists = await imagesToBytes(imgUrlLists)
    console.log('after bytes:', imgBytesLists)
    const labels = await analyzeImages(imgBytesLists)
    console.log('after labels:', labels)
    setWordImages([...wordImages, ...labels])

    setActiveWords([...activeWords, ...inactiveWords])
    setInactiveWords([])

    const sortedLabels = sortLabels(labels, 10)

    setAssociations(sortedLabels)
    setProcessing(false)
  }

  const styles = setStyles()

  return (
    <Paper className={styles.paper}>
      <h2>Word list</h2>
      <List>
        {activeWords.map(word => (
          <WordListItem
            key={word.name}
            selected={{ selected, setSelected }}
            word={word}
            removeWord={removeWord}
            filterByWord={filterByWord}
          />
        ))}
        {inactiveWords.map(word => (
          <WordListItem
            key={word.name}
            selected={{ selected, setSelected }}
            word={word}
            removeWord={removeWord}
            filterByWord={filterByWord}
            disabled
          />
        ))}
        {activeWords.length + inactiveWords.length < 3 && (
          <Container>
            <form autoComplete="off" onSubmit={addWord}>
              <TextField
                variant="filled"
                onChange={event => setInput(event.target.value)}
                value={formState.name}
                label="New word"
                color="secondary"
              />
              <IconButton edge="end" type="submit" color="secondary">
                <Add />
              </IconButton>
            </form>
          </Container>
        )}
      </List>
      {inactiveWords[0] && (
        <Button onClick={getAssociations} variant="contained" color="primary">
          {!activeWords.length ? 'Create word list' : 'Update word list'}
        </Button>
      )}
    </Paper>
  )
}

const setStyles = makeStyles({
  paper: {
    padding: '1rem',
    margin: '5em',
  },
})
