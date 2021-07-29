/* src/App.js */
import { useState, useMemo } from 'react'
import { createTheme, ThemeProvider, useMediaQuery } from '@material-ui/core'
import { teal, grey } from '@material-ui/core/colors'
import { listWordLists, createWordList, getWordList } from './graphql'
import { useEffect } from 'react'
import Amplify, { API, Auth, Hub } from 'aws-amplify'
import { MobileView, DesktopView } from './layouts'

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
    isSignedIn: Boolean(Auth.currentAuthenticatedUser),
  })

  const signIn = async (email: string, password: string) => {
    try {
      await Auth.signIn(email, password)
    } catch (error) {
      setSnackMessage('Error signing in: ' + error.code)
      return error.code as string
    }
  }

  const signOut = async () => {
    try {
      await Auth.signOut()
    } catch (error) {
      setSnackMessage('Error signing out: ' + error.code)
      return error.code as string
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { user: newUser } = await Auth.signUp({
        username: email,
        password: password,
      })
    } catch (error) {
      setSnackMessage('Error signing up: ' + error.code)
      console.log(error)
      return error.code as string
    }
  }

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
                variables: { id: list.id  },
              })) as { data: { getWordList: { words: { items: Word[] } } } }

              return { ...list, words: { inactive: items } }
            })

            const resolvedWordLists = await Promise.all(convertedWordLists)

            setWordLists(resolvedWordLists)
            setActiveListId(resolvedWordLists[0].id)
          } else {
            !wordLists.length && makeWordList()
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

      const createListData = (await API.graphql({
        query: createWordList,
        variables: { input: { name: newName } },
      })) as { data: { createWordList: { id: string } } }

      const newWordList = {
        name: newName,
        filters: { words: new Array<string>(), labels: new Array<string>() },
        id: createListData.data.createWordList.id,
      }

      setWordLists([...wordLists, newWordList])
      setActiveListId(newWordList.id)
      setSnackMessage('Successfully created list!!')
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
