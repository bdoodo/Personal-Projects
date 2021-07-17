import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { createWord, listWords, deleteWord } from '../graphql'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import {
  List,
  IconButton,
  makeStyles,
  Container,
  TextField,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardContent,
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
  processing: { processing, setProcessing },
}: {
  filters: FiltersState
  wordImages: {
    wordImages: WordImages[]
    setWordImages: React.Dispatch<React.SetStateAction<WordImages[]>>
  }

  setAssociations: React.Dispatch<React.SetStateAction<Association[]>>
  processing: {
    processing: boolean
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>
  }
}) => {
  const [formState, setFormState] = useState({ name: '' })
  const [selected, setSelected] = useState(new Array<string>())
  const [activeWords, setActiveWords] = useState(new Array<Word>())
  const [inactiveWords, setInactiveWords] = useState(new Array<Word>())

  const maxWordsLength = 3

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
  useEffect(() => {
    fetchWords()
  }, [])

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

  //TODO: Include a unit test of removeWord. Sometimes it doesn't disappear correctly
  const removeWord = async (word: string) => {
    //Find whether the word to be removed is in activeWords or inactiveWords
    const partOfActiveWords = activeWords.find(({ name }) => name === word)
    try {
      //If the deleted word was in filters, pass it to filterByWord to remove it
      filters.words.includes(word) && filterByWord(word)

      //Remove from 'selected' if it was in there
      selected.includes(word) && setSelected(selected.filter(e => e !== word))

      //Remove from the appropriate list
      partOfActiveWords
        ? setActiveWords(activeWords.filter(({ name }) => name !== word))
        : setInactiveWords(inactiveWords.filter(({ name }) => name !== word))

      //Update wordImages and associations
      setWordImages(wordImages.filter(({ word: { name } }) => name !== word))
      setAssociations(
        sortLabels(wordImages.filter(({ word: { name } }) => name !== word))
      )

      await API.graphql(graphqlOperation(deleteWord, { input: { name: word } }))
    } catch (err) {
      console.log('error deleting word:', err)
    }
  }

  const filterByWord = (word: string) => {
    //If the clicked word is already in 'filters,' remove it from filters; otherwise, add it.
    filters.words.includes(word)
      ? setFilters({
          ...filters,
          words: filters.words.filter(wordFilter => wordFilter !== word),
        })
      : setFilters({ ...filters, words: [...filters.words, word] })
  }

  /**Initiate all processing for input words */
  const getAssociations = async () => {
    setProcessing(true)

    //wordImages ...
    const afterUrls = await fetchUrlLists(inactiveWords)
    const afterBytes = await imagesToBytes(afterUrls)
    const afterLabels = await analyzeImages(afterBytes)
    setWordImages([...wordImages, ...afterLabels])

    setActiveWords([...activeWords, ...inactiveWords])
    setInactiveWords([])

    const sortedLabels = sortLabels([...wordImages, ...afterLabels])

    setAssociations(sortedLabels)
    setProcessing(false)
  }

  //When a word list is completely filled out, focus on the submit button
  const createWordsButton = useRef<HTMLButtonElement>(null)
  useLayoutEffect(() => {
    activeWords.length + inactiveWords.length === maxWordsLength &&
      createWordsButton.current?.focus()
  }, [inactiveWords])

  const styles = setStyles()

  return (
    <Card className={styles.paper}>
      <CardHeader title="Word list" />
      <CardContent>
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
          {activeWords.length + inactiveWords.length < maxWordsLength && (
            <Container className={styles.wordInput}>
              <form autoComplete="off" onSubmit={addWord}>
                <TextField
                  variant="filled"
                  onChange={event => setFormState({ name: event.target.value })}
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
      </CardContent>
      <CardActions className={styles.centerFlex}>
        {inactiveWords[0] && (
          <Button
            onClick={getAssociations}
            variant="contained"
            color="primary"
            disabled={processing}
            ref={createWordsButton}
          >
            {!activeWords.length ? 'Create word list' : 'Update word list'}
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

const setStyles = makeStyles({
  paper: {
    margin: '5em 3em',
  },
  centerFlex: {
    display: 'flex',
    justifyContent: 'center',
  },
  wordInput: {
    marginTop: '1rem',
  },
})
