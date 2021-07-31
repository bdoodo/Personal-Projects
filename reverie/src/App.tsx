/* src/App.js */
import { useState, useMemo } from 'react'
import { createTheme, ThemeProvider, useMediaQuery } from '@material-ui/core'
import { teal, grey } from '@material-ui/core/colors'
import { listWordLists, createWordList, getWordList } from './graphql'
import { useEffect } from 'react'
import Amplify, { API } from 'aws-amplify'
import { MobileView, DesktopView } from './layouts'
import { Auth } from 'aws-amplify'

import awsConfig from './aws-exports'
Amplify.configure(awsConfig)

export const App = () => {
  const [status, setStatus] = useState('')

  const [snackMessage, setSnackMessage] = useState('')

  const [user, setUser] = useState<{
    email: string | undefined
    password: string | undefined
    isSignedIn: boolean
  }>({
    email: undefined,
    password: undefined,
    isSignedIn: false,
  })

  const isSignedIn = async () => {
    try {
      await Auth.currentAuthenticatedUser()
      return true
    } catch {
      return false
    }
  }
  useEffect(() => {
    ;(async () => setUser({ ...user, isSignedIn: await isSignedIn() }))()
  }, [])

  const [wordLists, setWordLists] = useState(new Array<WordList>())
  const [activeListId, setActiveListId] = useState<string>()
  //Set wordLists to fetched word lists, or create a new one
  useEffect(() => {
    if (user.isSignedIn) {
      ;(async () => {
        try {
          const wordListData = (await API.graphql({
            query: listWordLists,
          })) as {
            data: {
              listWordLists: {
                items: { id: string; name: string }[]
              }
            }
          }
          const fetchedWordLists = wordListData.data.listWordLists.items

          if (fetchedWordLists.length) {
            //Word lists stored in graphQL resemble a slightly different shape
            //than lists in app. Convert them to resemble app shape here
            const convertedWordLists = fetchedWordLists.map(async list => {
              const {
                data: {
                  getWordList: {
                    words: { items },
                  },
                },
              } = (await API.graphql({
                query: getWordList,
                variables: { id: list.id },
              })) as { data: { getWordList: { words: { items: Word[] } } } }

              return { ...list, words: { inactive: items } }
            })

            const resolvedWordLists = await Promise.all(convertedWordLists)

            setWordLists(resolvedWordLists)
            setActiveListId(resolvedWordLists[0].id)
          } else {
            setWordLists([])
            makeWordList()
          }
        } catch (error) {
          console.log('error fetching word lists', error)
        }
      })()
    } else {
      !wordLists.length && makeWordList()
    }
  }, [user.isSignedIn])

  const makeWordList = async () => {
    try {
      const newName = `Word List ${wordLists.length + 1}`

      let newWordList = {
        name: newName,
        filters: { words: new Array<string>(), labels: new Array<string>() },
        id: '',
      }

      if (user.isSignedIn) {
        const createListData = (await API.graphql({
          query: createWordList,
          variables: { input: { name: newName } },
        })) as { data: { createWordList: { id: string } } }

        newWordList.id = createListData.data.createWordList.id
      } else {
        newWordList.id = Math.random().toString()
      }

      setWordLists([...wordLists, newWordList])
      setActiveListId(newWordList.id)
    } catch (error) {
      console.log('Error creating new word list', error)
    }
  }

  //Expands a word list if it's inactive and sets it to active
  const expand = (list: WordList) =>
    !status && !isActive(list) ? setActiveListId(list.id) : undefined

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            ...teal,
            main: teal[100],
            dark: teal[500],
          },
          secondary: {
            ...grey,
            main: grey[500],
            dark: grey[600],
          },
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  )

  /**Compares a word list to the active word list */
  const isActive = (list: WordList) => activeListId === list.id

  //Passed down to layouts
  const resourcePack = {
    status,
    setStatus,
    wordLists,
    setWordLists,
    makeWordList,
    activeListId,
    setActiveListId,
    expand,
    isActive,
    user,
    setUser,
    snackMessage,
    setSnackMessage,
  }

  return (
    <ThemeProvider theme={theme}>
      {useMediaQuery(`(min-width: ${theme.breakpoints.values.md}px)`) ? (
        <DesktopView {...resourcePack} />
      ) : (
        <MobileView {...resourcePack} />
      )}
    </ThemeProvider>
  )
}
