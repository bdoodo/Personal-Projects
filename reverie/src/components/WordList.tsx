import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { createWord, deleteWord } from '../graphql'
import { API, graphqlOperation } from 'aws-amplify'
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
  Menu,
  MenuItem,
} from '@material-ui/core'
import { Add, MoreVert } from '@material-ui/icons'
import {
  analyzeImages,
  fetchUrlLists,
  imagesToBytes,
  sortLabels,
} from '../utils'
import { WordListItem } from './'
import { deleteWordList, updateWordList } from '../graphql'

export const WordList = ({
  status,
  setStatus,
  wordLists,
  setWordLists,
  activeListId,
  setActiveListId,
  meta,
  mobile,
  setSnackMessage,
  user,
}: {
  status: string
  setStatus: React.Dispatch<React.SetStateAction<string>>
  wordLists: WordList[]
  setWordLists: React.Dispatch<React.SetStateAction<WordList[]>>
  activeListId: string | undefined
  setActiveListId: React.Dispatch<React.SetStateAction<string | undefined>>
  meta: WordList
  mobile?: boolean
  setSnackMessage: React.Dispatch<React.SetStateAction<string>>
  user: {
    email: string | undefined
    password: string | undefined
    isSignedIn: boolean
  }
}) => {
  const [formState, setFormState] = useState({ name: '' })
  const [wordImages, setWordImages] = useState(new Array<WordImages>())
  const [associations, setAssociations] = useState(new Array<Association>())
  const [activeWords, setActiveWords] = useState(new Array<Word>())
  const [inactiveWords, setInactiveWords] = useState(new Array<Word>())
  const [listTitle, setListTitle] = useState<string>(meta.name)
  const [filters, setFilters] = useState({
    words: new Array<string>(),
    labels: new Array<string>(),
  })

  const id = meta.id
  const activeIndex = wordLists.findIndex(list => list.id === id)

  //On render, update list properties with list state properties from app
  useEffect(() => {
    console.log(meta)
    setListTitle(meta.name)
    meta.words?.active && setActiveWords(meta.words.active)
    meta.words?.inactive && setInactiveWords(meta.words.inactive)
    meta.wordImages && setWordImages(meta.wordImages)
    meta.associations && setAssociations(meta.associations)
    meta.filters && setFilters(meta.filters)
  }, [])

  //Update active word list properties whenever something from this word list changes
  useEffect(() => {
    const current = {
      name: listTitle,
      words: {
        active: activeWords,
        inactive: inactiveWords,
      },
      wordImages: wordImages,
      associations: associations,
      filters: {
        labels: wordLists[activeIndex].filters?.labels || [],
        words: filters.words,
      },
    }

    //Update this list in wordLists
    const newWordLists = wordLists
    newWordLists[activeIndex] = { ...newWordLists[activeIndex], ...current }

    setWordLists(newWordLists)
  }, [
    listTitle,
    activeWords,
    inactiveWords,
    wordImages,
    associations,
    filters.words,
  ])

  const maxWordsLength = 3

  const addWord = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      if (!formState.name) return
      const word = { name: formState.name, wordListID: activeListId! } as Word

      setInactiveWords([...inactiveWords, word])
      setFormState({ name: '' })
    } catch (err) {
      console.log('error creating word:', err)
    }
  }

  const removeWord = async (word: Word) => {
    //Find whether the word to be removed is in activeWords or inactiveWords
    const partOfActiveWords = activeWords.find(({ name }) => name === word.name)
    try {
      //If the deleted word was in filters, pass it to filterByWord to remove it
      filters.words.includes(word.name) && filterByWord(word.name)

      //Remove from the appropriate list
      partOfActiveWords
        ? setActiveWords(activeWords.filter(({ name }) => name !== word.name))
        : setInactiveWords(
            inactiveWords.filter(({ name }) => name !== word.name)
          )

      //Update wordImages and associations
      setWordImages(
        wordImages.filter(({ word: { name } }) => name !== word.name)
      )
      setAssociations(
        sortLabels(
          wordImages.filter(({ word: { name } }) => name !== word.name)
        )
      )

      //Remove from database
      user.isSignedIn &&
        (await API.graphql({
          query: deleteWord,
          variables: { input: { id: word.id } },
        }))
    } catch (err) {
      console.log('error deleting word:', err)
    }
  }

  //Add a word filter if it's selected
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
    //Exit if there are no words to process
    if (!inactiveWords) return

    setStatus('Getting URL lists ...')

    const afterUrls = await fetchUrlLists(inactiveWords)

    setStatus('Fetching images and converting them to bytes ...')
    const afterBytes = await imagesToBytes(afterUrls)

    setStatus('Analyzing images ...')
    const afterLabels = await analyzeImages(afterBytes)

    setStatus('Finding associations ...')
    const sortedLabels = sortLabels([
      ...(meta.wordImages || []),
      ...afterLabels,
    ])

    //Create new active words from inactive words and store their ids
    const newActiveWords = inactiveWords.map(async word => {
      const newActiveWord = user.isSignedIn ?
      (await API.graphql({
        query: createWord,
        variables: { input: word },
      })) as { data: { createWord: { id: string } } }
      : undefined

      return { ...word, id: newActiveWord?.data.createWord.id || Math.random().toString() } as Word
    })

    const resolvedNewActiveWords = await Promise.all(newActiveWords)

    const newProperties = {
      wordImages: [...wordImages, ...afterLabels],
      words: {
        active: [...activeWords, ...resolvedNewActiveWords],
        inactive: [],
      },
      associations: sortedLabels,
    }

    setWordImages(newProperties.wordImages)
    setActiveWords(newProperties.words.active)
    setInactiveWords(newProperties.words.inactive)
    setAssociations(newProperties.associations)

    //Update this list in wordLists
    const newWordLists = wordLists
    newWordLists[activeIndex] = {
      ...newWordLists[activeIndex],
      ...newProperties,
    }
    setWordLists(newWordLists)

    setStatus('')
  }

  //When this list is completely filled out, focus on the submit button
  const createWordsButton = useRef<HTMLButtonElement>(null)
  useLayoutEffect(() => {
    activeWords.length + inactiveWords.length === maxWordsLength &&
      createWordsButton.current?.focus()
  }, [inactiveWords])

  const removeWordList = async () => {
    try {
      //Change the active list to the one before or after this (undefined if no other lists)
      const listIndex = wordLists.findIndex(list => list.id === id)
      setActiveListId(
        wordLists[listIndex + 1].id || wordLists[listIndex - 1].id
      )

      //Remove from app state and database
      user.isSignedIn &&
        (await API.graphql({
          query: deleteWordList,
          variables: { input: { id } },
        }))
      setWordLists(wordLists.filter(list => list.id !== id))
      console.log('deleted list')
    } catch (error) {
      setSnackMessage('Error deleting list: ' + error)
      console.error(error)
      console.log('id:', id)
    }
  }

  const updateTitle = async () => {
    if (!user.isSignedIn) return
    try {
      await API.graphql({
        query: updateWordList,
        variables: { input: { id: activeListId, name: listTitle } },
      })
    } catch (error) {
      setSnackMessage('error updating list title: ' + error.code)
    }
  }

  /**Checks whether this word list is active */
  const isActive = () => activeListId === id

  //Used for the menu button on this list
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef(null)

  const styles = makeStyles(theme => ({
    paper: {
      margin: isActive() ? '3rem auto' : '0.1rem auto',
      maxWidth: '400px',
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
      cursor: isActive() ? 'pointer' : 'default',
      textOverflow: 'ellipsis',
      maxWidth: 200,
      '&:focus': {
        cursor: 'text',
      },
    },
    menuButton: {
      float: 'right',
    },
  }))()

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
            onChange={e => setListTitle(e.target.value)}
            disabled={!isActive()}
            onClick={e => e.target.select()}
            onBlur={updateTitle}
          />
          <IconButton
            ref={menuButtonRef}
            onClick={() => setMenuOpen(!menuOpen)}
            disabled={!isActive()}
            className={styles.menuButton}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={menuButtonRef.current}
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
          >
            <MenuItem onClick={removeWordList}>Delete list</MenuItem>
          </Menu>
        </Typography>
        <List>
          {activeWords.map(word => (
            <WordListItem
              key={word.name}
              filters={{ filters, setFilters }}
              word={word}
              removeWord={removeWord}
              filterByWord={filterByWord}
              disabled={!isActive()}
              mobile={mobile}
            />
          ))}
          {inactiveWords.map(word => (
            <WordListItem
              key={word.name}
              filters={{ filters, setFilters }}
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
