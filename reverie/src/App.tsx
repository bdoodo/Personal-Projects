/* src/App.js */
import { useState, useMemo } from 'react'
import { ImageGrid, WordList, Associations } from './components'
import {
  Grid,
  Divider,
  makeStyles,
  createTheme,
  ThemeProvider,
  useMediaQuery,
  Container,
  Fab,
  Collapse,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from '@material-ui/core'
import { Add } from '@material-ui/icons'
import {
  orange,
  red,
  blueGrey,
  amber,
  common,
  lightBlue,
  teal,
  grey,
} from '@material-ui/core/colors'
import {
  listWordLists,
  createWordList,
  deleteWordList,
  updateWordList,
} from './graphql'
import { useEffect } from 'react'
import Amplify, { API } from 'aws-amplify'

export const App = () => {
  const [status, setStatus] = useState('')

  const [wordLists, setWordLists] = useState(new Array<WordList>())
  //Set wordLists to fetched word lists, or create a new one
  useEffect(() => {
    const fetchWordLists = (async () => {
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

  const [activeWordList, setActiveWordList] = useState<WordList>()
  //Only used for first render, after wordlists have been fetched. Selects
  //an activeWordList if none exists
  useEffect(() => {
    activeWordList || setActiveWordList(wordLists[0])
  }, [wordLists])

  //Expands a word list if it's inactive and sets it to active
  const expand = (list: WordList) => {
    if (!status)
      return isActive(list)
        ? undefined
        : setActiveWordList(wordLists.find(wordList => wordList.id === list.id))
  }
  const styles = setStyles()

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

  return (
    <ThemeProvider theme={theme}>
      <Container className={styles.root}>
        <AppBar>
          <Toolbar>
            <Typography className={styles.title} variant="h6">
              Reverie
            </Typography>
            <Button className={styles.signIn}>Log in</Button>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Grid container spacing={5}>
          <Grid
            item
            xs={5}
            alignContent="center"
            direction="column"
            className={styles.wordListGrid}
          >
            {wordLists.map(wordList => (
              <Collapse
                key={wordList.id}
                in={isActive(wordList)}
                collapsedSize={80}
              >
                <div
                  onClick={() => expand(wordList)}
                  className={
                    isActive(wordList)
                      ? styles.expandedList
                      : styles.collapsedList
                  }
                >
                  <WordList
                    status={{ status, setStatus }}
                    wordLists={{ wordLists, setWordLists }}
                    activeWordList={{ activeWordList, setActiveWordList }}
                    title={wordList.name}
                    id={wordList.id}
                  />
                </div>
              </Collapse>
            ))}
            {wordLists.length < 5 && (
              <Fab
                color="primary"
                aria-label="New word list"
                onClick={makeWordList}
                className={styles.fab}
              >
                <Add />
              </Fab>
            )}
          </Grid>
          <Divider orientation="vertical" className={styles.divider} />
          <Grid item xs={6}>
            <Associations
              associations={activeWordList?.associations}
              status={status}
              filters={activeWordList?.filters}
              activeWordList={{ activeWordList, setActiveWordList }}
              wordImagesList={activeWordList?.wordImages}
            />
            <ImageGrid
              wordImagesList={activeWordList?.wordImages}
              status={status}
              filters={activeWordList?.filters}
            />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

const setStyles = makeStyles(theme => ({
  root: {
    height: '100%',
  },
  divider: {
    height: '60%',
    alignSelf: 'center',
  },
  fab: {
    margin: '0 auto',
  },
  wordListGrid: {
    display: 'flex',
    height: '100%',
    marginTop: '2rem',
  },
  collapsedList: {
    cursor: 'pointer',
  },
  expandedList: {
    cursor: 'default',
  },
  signIn: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    userSelect: 'none',
  },
}))
