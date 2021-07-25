/* src/App.js */
import { useState, useMemo } from 'react'
import { createTheme, ThemeProvider, useMediaQuery } from '@material-ui/core'
import { teal, grey } from '@material-ui/core/colors'
import {
  listWordLists,
  createWordList,
  deleteWordList,
  updateWordList,
} from './graphql'
import { useEffect } from 'react'
import Amplify, { API, Auth, Hub } from 'aws-amplify'
import { MobileView, DesktopView } from './layouts'

import awsConfig from './aws-exports'
const configureAws = (() => {
  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
  )

  const [localRedirectSignIn, productionRedirectSignIn] =
    awsConfig.oauth.redirectSignIn.split(',')
    console.log('localRedirectSignIn:', localRedirectSignIn)

  const [localRedirectSignOut, productionRedirectSignOut] =
    awsConfig.oauth.redirectSignOut.split(',')

  const updatedAwsConfig = {
    ...awsConfig,
    oauth: {
      ...awsConfig.oauth,
      redirectSignIn: isLocalhost
        ? localRedirectSignIn
        : productionRedirectSignIn,
      redirectSignOut: isLocalhost
        ? localRedirectSignOut
        : productionRedirectSignOut,
    },
  }
  Amplify.configure(updatedAwsConfig)
})()


export const App = () => {
  const [status, setStatus] = useState('')

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      event === 'signIn'
        ? setUser({ user: data })
        : //event === signOut
          setUser({ user: null })
    })
    ;(async () => {
      try {
        const user = await Auth.currentAuthenticatedUser()
        setUser({ user })
      } catch {
        console.log('Not signed in')
      }
    })()
  }, [])

  const signIn = () => Auth.federatedSignIn({ provider: 'Google' })

  const signOut = () => Auth.signOut()

  const [wordLists, setWordLists] = useState(new Array<WordList>())
  //Set wordLists to fetched word lists, or create a new one
  useEffect(() => {
    ;(async () => {
      try {
        /*const wordListData = (await API.graphql({ query: listWordLists })) as {
          data: { listWordLists: { items: WordList[] } }
        }
        const fetchedWordLists = wordListData.data.listWordLists.items

        fetchedWordLists.length
          ? setWordLists(fetchedWordLists)
          :*/ !wordLists.length && makeWordList()
      } catch {
        console.log('error fetching word lists')
      }
    })()
  }, [])

  const [activeWordList, setActiveWordList] = useState<WordList>()
  //Only used for first render, after wordlists have been fetched. Selects
  //an activeWordList if none exists
  useEffect(() => {
    !activeWordList && setActiveWordList(wordLists[0])
  }, [wordLists])

  const makeWordList = async () => {
    try {
      const newName = `Word List ${wordLists.length + 1}`
      const newWordList = {
        name: newName,
        id: `id${Math.random()}`,
        filters: { words: new Array<string>(), labels: new Array<string>() },
      }

      /*const newWordList = (await API.graphql({
        query: createWordList,
        variables: { input: { name: newName } },
      })) as { data: { createWordList: { id: string } } }

      const id = newWordList.data.createWordList.id*/

      setWordLists([...wordLists, newWordList])
      setActiveWordList(newWordList)
    } catch (error) {
      console.log('Error creating new word list', error)
    }
  }

  //Expands a word list if it's inactive and sets it to active
  const expand = (list: WordList) =>
    !status && !isActive(list)
      ? setActiveWordList(wordLists.find(wordList => wordList.id === list.id))
      : undefined

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
  const isActive = (list: WordList) => activeWordList?.id === list.id

  //Passed down to layouts
  const resourcePack = {
    status: status,
    setStatus: setStatus,
    wordLists: wordLists,
    setWordLists: setWordLists,
    makeWordList: makeWordList,
    activeWordList: activeWordList,
    setActiveWordList: setActiveWordList,
    expand: expand,
    isActive: isActive,
    auth: { signIn, signOut },
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
