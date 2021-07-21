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
  Button,
} from '@material-ui/core'
import { Add } from '@material-ui/icons'
import {
  listWordLists,
  createWordList,
  deleteWordList,
  updateWordList,
} from './graphql'
import { useEffect } from 'react'
import Amplify, { API } from 'aws-amplify'

export const App = () => {
  //States for the active word list
  const [wordImages, setWordImages] = useState(new Array<WordImages>())
  const [associations, setAssociations] = useState(new Array<Association>())
  const [status, setStatus] = useState('')
  const [filters, setFilters] = useState({
    words: new Array<string>(),
    labels: new Array<string>(),
  })

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
          :*/ makeWordList()
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
        id: `id${Math.random() * Math.random()}`,
      }

      /*const newWordList = (await API.graphql({
        query: createWordList,
        variables: { input: { name: newName } },
      })) as { data: { createWordList: { id: string } } }

      const id = newWordList.data.createWordList.id*/

      setWordLists([...wordLists, newWordList])
      setActiveWordList(newWordList)
      console.log('active word list name:', activeWordList?.name)
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

  const expand = (list: WordList) => {
    setActiveWordList(wordLists.find(wordList => wordList.id === list.id))
  }

  const styles = setStyles()

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
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
        <Grid container spacing={5}>
          <Grid item xs={5}>
            {wordLists.map(wordList => (
              <Collapse
                key={wordList.id}
                in={isActive(wordList)}
                collapsedSize={150}
              >
                <div
                  onClick={
                    isActive(wordList)
                      ? undefined
                      : () => {
                          expand(wordList)
                        }
                  }
                >
                  <WordList
                    wordImages={{ wordImages, setWordImages }}
                    filters={{ filters, setFilters }}
                    status={{ status, setStatus }}
                    setAssociations={setAssociations}
                    activeWordList={{ activeWordList, setActiveWordList }}
                    title={wordList.name}
                  />
                </div>
              </Collapse>
            ))}
            <Fab
              color="primary"
              aria-label="New word list"
              onClick={makeWordList}
            >
              <Add />
            </Fab>
          </Grid>
          <Divider orientation="vertical" className={styles.divider} />
          <Grid item xs={6}>
            <Associations
              associations={associations}
              status={status}
              filters={{ filters, setFilters }}
              wordImagesList={wordImages}
            />
            <ImageGrid
              wordImagesList={wordImages}
              status={status}
              filters={filters}
            />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

const setStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  divider: {
    height: '60%',
    alignSelf: 'center',
  },
}))
