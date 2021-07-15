import React, { useState, useEffect } from 'react'
import { createWord, listWords, deleteWord } from '../graphql'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import {
  List,
  ListItem,
  IconButton,
  ListItemText,
  Button,
  ListItemSecondaryAction,
  makeStyles,
} from '@material-ui/core'
import { DeleteOutlined } from '@material-ui/icons'

import awsExports from '../aws-exports'
Amplify.configure(awsExports)

export const WordList = ({
  setActiveWords,
  filtersState: { filters, setFilters },
}: {
  setActiveWords: React.Dispatch<React.SetStateAction<Word[]>>
  filtersState: FiltersState
}) => {
  const [formState, setFormState] = useState({ name: '' })
  const [words, setWords] = useState(new Array<Word>())
  const [selected, setSelected] = useState(
    new Array<boolean>(words.length).fill(false)
  )

  useEffect(() => {
    fetchWords()
  }, [])

  const setInput = (key: string, value: string) => {
    setFormState({ ...formState, [key]: value })
  }

  const fetchWords = async () => {
    try {
      const wordData = (await API.graphql(graphqlOperation(listWords))) as {
        data: { listWords: { items: Word[] } }
      }
      const words = wordData.data.listWords.items
      setWords(words)
      setActiveWords(words)
    } catch (err) {
      console.log('error fetching words')
    }
  }

  const addWord = async () => {
    try {
      if (!formState.name) return
      const word = { ...formState }
      setActiveWords([...words, word])
      setWords([...words, word])
      setFormState({ name: '' })
      await API.graphql(graphqlOperation(createWord, { input: word }))
    } catch (err) {
      console.log('error creating word:', err)
    }
  }

  const removeWord = async (word: string) => {
    const tempWords = words
    //Cut out the word to be deleted
    tempWords.splice(
      words.findIndex(e => e.name === word),
      1
    )
    try {
      //If the removed word was in filters, remove it from filters
      filters.words.includes(word) && filterByWord(word)
      setWords(tempWords)
      setActiveWords(tempWords)
      await API.graphql(graphqlOperation(deleteWord, { input: { name: word } }))
    } catch (err) {
      console.log('error deleting word:', err)
    }
  }

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

  /**On click, update word filters and toggle selected */
  const handleItemClick = (word: string, index: number) => {
    filterByWord(word)

    const tempSelected = selected
    tempSelected[index] = !tempSelected[index]
    setSelected(tempSelected)
  }

  const styles = setStyles()

  //TODO: Disable filter functionality before getImages.
  //The words should be 'disabled' before they're updated to the word list
  return (
    <>
      <h2>Word list</h2>
      <input
        onChange={event => setInput('name', event.target.value)}
        value={formState.name}
        placeholder="Name"
      />
      <Button onClick={addWord}>Create Word</Button>
      <List className={styles.list}>
        {words.map((word, index) => (
          <ListItem
            key={word.id}
            role="list"
            button
            onClick={() => {
              handleItemClick(word.name, index)
            }}
            selected={selected[index]}
          >
            <ListItemText>{word.name}</ListItemText>
            <ListItemSecondaryAction>
              <IconButton>
                <DeleteOutlined
                  onClick={() => {
                    removeWord(word.name)
                  }}
                />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  )
}

const setStyles = makeStyles({
  list: {
    maxWidth: '30%',
  },
})
