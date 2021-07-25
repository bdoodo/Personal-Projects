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


export const WordList = ({
  status: { status, setStatus },
  wordLists: { wordLists, setWordLists },
  activeWordList: { activeWordList, setActiveWordList },
  meta,
  mobile
}: {
  status: {
    status: string
    setStatus: React.Dispatch<React.SetStateAction<string>>
  }
  wordLists: {
    wordLists: WordList[]
    setWordLists: React.Dispatch<React.SetStateAction<WordList[]>>
  }
  activeWordList: {
    activeWordList: WordList | undefined
    setActiveWordList: React.Dispatch<
      React.SetStateAction<WordList | undefined>
    >
  }
  meta: WordList
  mobile?: boolean
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
    setListTitle(meta.name)
    meta.words?.active && setActiveWords(meta.words.active)
    meta.words?.inactive && setInactiveWords(meta.words.inactive)
    meta.wordImages && setWordImages(meta.wordImages)
    meta.associations && setAssociations(meta.associations)
    setFilters(meta.filters)
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
        labels: wordLists[activeIndex].filters.labels!,
        words: filters.words,
      },
    }

    setActiveWordList({
      ...activeWordList,
      ...current,
    })

    //Update this list in wordLists
    const newWordLists = wordLists
    newWordLists[activeIndex] = { ...newWordLists[activeIndex], ...current }

    setWordLists(newWordLists)
  }, [listTitle, activeWords, inactiveWords, wordImages, associations, filters.words])

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

  const removeWord = async (word: string) => {
    //Find whether the word to be removed is in activeWords or inactiveWords
    const partOfActiveWords = activeWords.find(({ name }) => name === word)
    try {
      //If the deleted word was in filters, pass it to filterByWord to remove it
      filters.words.includes(word) && filterByWord(word)

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
    //Exit if there are no words to process
    if (!activeWordList?.words?.inactive) return

    setStatus('Getting URL lists ...')

    const afterUrls = await fetchUrlLists(activeWordList.words.inactive)

    setStatus('Fetching images and converting them to bytes ...')
    const afterBytes = await imagesToBytes(afterUrls)

    setStatus('Analyzing images ...')
    const afterLabels = await analyzeImages(afterBytes)

    setStatus('Finding associations ...')
    const sortedLabels = sortLabels([
      ...(activeWordList?.wordImages || []),
      ...afterLabels,
    ])

    const newProperties = {
      wordImages: [...wordImages, ...afterLabels],
      words: {
        active: [...activeWords, ...inactiveWords],
        inactive: [],
      },
      associations: sortedLabels,
    }

    setWordImages(newProperties.wordImages)
    setActiveWords(newProperties.words.active)
    setInactiveWords(newProperties.words.inactive)
    setAssociations(newProperties.associations)

    setActiveWordList({
      ...activeWordList,
      ...newProperties,
    })

    //Update this list in wordLists
    const newWordLists = wordLists
    newWordLists[activeIndex] = {
      ...newWordLists[activeIndex],
      ...newProperties,
    }
    setWordLists(newWordLists)

    setStatus('')
  }

  //When a word list is completely filled out, focus on the submit button
  const createWordsButton = useRef<HTMLButtonElement>(null)
  useLayoutEffect(() => {
    activeWords.length + inactiveWords.length === maxWordsLength &&
      createWordsButton.current?.focus()
  }, [inactiveWords])

  const titleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
    event.target.select()

  const deleteWordList = () => {
    const listIndex = wordLists.findIndex(list => list.id === id)
    setActiveWordList(wordLists[listIndex + 1] || wordLists[listIndex - 1])

    setWordLists(wordLists.filter(list => list.id !== id))
  }

  /**Checks whether this word list is active */
  const isActive = () => activeWordList?.id === id

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
            onClick={titleClick}
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
            <MenuItem onClick={deleteWordList}>Delete list</MenuItem>
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
