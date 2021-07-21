import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { createWord, deleteWord } from '../graphql'
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
  CardContent,
  Input,
  Typography,
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
  status: { status, setStatus },
  activeWordList: { activeWordList, setActiveWordList },
  title
}: {
  filters: FiltersState
  wordImages: {
    wordImages: WordImages[]
    setWordImages: React.Dispatch<React.SetStateAction<WordImages[]>>
  }
  setAssociations: React.Dispatch<React.SetStateAction<Association[]>>
  status: {
    status: string
    setStatus: React.Dispatch<React.SetStateAction<string>>
  }
  activeWordList: {
    activeWordList: WordList | undefined
    setActiveWordList: React.Dispatch<
      React.SetStateAction<WordList | undefined>
    >
  }
  title: string
}) => {
  const [formState, setFormState] = useState({ name: '' })
  const [selected, setSelected] = useState(new Array<string>())
  const [activeWords, setActiveWords] = useState(new Array<Word>())
  const [inactiveWords, setInactiveWords] = useState(new Array<Word>())
  const [listTitle, setListTitle] = useState<string>(title)

  //Update active word list properties whenever something from this word list changes
  useEffect(() => {
    setActiveWordList({
      ...activeWordList,
      name: listTitle,
      words: activeWords,
    })
  }, [listTitle, activeWords])

  const maxWordsLength = 3

  /*useEffect(() => {
    const fetchWords = (async () => {
      try {
        const wordData = (await API.graphql({query: listWords})) as {
          data: { listWords: { items: Word[] } }
        }
        const activeWords = wordData.data.listWords.items
        setActiveWords(activeWords)
      } catch (err) {
        console.log('error fetching words')
      }
    })()
  }, [])*/

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
    setFilters({
      ...filters,
      //If the clicked word is already in 'filters,' remove it from filters; otherwise, add it.
      words: filters.words.includes(word)
        ? filters.words.filter(wordFilter => wordFilter !== word)
        : [...filters.words, word],
    })
  }

  /**Initiate all processing for input words */
  const getAssociations = async () => {
    setStatus('Getting URL lists ...')

    const afterUrls = await fetchUrlLists(inactiveWords)

    setStatus('Fetching images and converting them to bytes ...')
    const afterBytes = await imagesToBytes(afterUrls)

    setStatus('Analyzing images ...')
    const afterLabels = await analyzeImages(afterBytes)
    setWordImages([...wordImages, ...afterLabels])

    setActiveWords([...activeWords, ...inactiveWords])
    setInactiveWords([])

    setStatus('Finding associations ...')
    const sortedLabels = sortLabels([...wordImages, ...afterLabels])

    setAssociations(sortedLabels)
    setStatus('')
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
      <CardContent>
        <Typography variant="h5">
          <Input
            disableUnderline
            margin="none"
            value={listTitle}
            inputProps={{ 'aria-label': 'Word List Title' }}
            required
            classes={{ root: styles.listTitle, input: styles.input }}
            onChange={e => {
              setListTitle(e.target.value)
            }}
          />
        </Typography>
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
            disabled={status ? true : false}
            ref={createWordsButton}
          >
            {!activeWords.length ? 'Create word list' : 'Update word list'}
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

const setStyles = makeStyles(theme => ({
  paper: {
    margin: '5rem 3rem 0',
    [theme.breakpoints.up('lg')]: {
      position: 'fixed',
      minWidth: '325px',
    },
  },
  centerFlex: {
    display: 'flex',
    justifyContent: 'center',
  },
  wordInput: {
    marginTop: '1rem',
  },
  listTitle: {
    fontSize: '1.5rem',
    fontWeight: 400,
    lineHeight: 1.334,
    letterSpacing: '0em',
  },
  input: {
    cursor: 'pointer',
    '&:focus': {
      cursor: 'text',
    },
  },
}))
