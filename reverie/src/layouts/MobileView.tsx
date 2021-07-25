import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Collapse,
  Button,
  Tab,
  Fab,
  makeStyles,
  Slide,
} from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { TabList, TabContext, TabPanel } from '@material-ui/lab'
import { useEffect } from 'react'
import { useState } from 'react'
import { WordList, Associations, ImageGrid } from '../components'

export const MobileView = ({
  status,
  setStatus,
  wordLists,
  setWordLists,
  makeWordList,
  activeWordList,
  setActiveWordList,
  expand,
  isActive,
  auth: {signIn, signOut}
}: {
  status: string
  setStatus: React.Dispatch<React.SetStateAction<string>>
  wordLists: WordList[]
  setWordLists: React.Dispatch<React.SetStateAction<WordList[]>>
  makeWordList: () => Promise<void>
  activeWordList: WordList | undefined
  setActiveWordList: React.Dispatch<React.SetStateAction<WordList | undefined>>
  expand: (list: WordList) => void
  isActive: (list: WordList) => boolean
  auth: {
    signIn: () => Promise<ICredentials>
    signOut: () => Promise<any>
  }
}) => {
  const [tab, setTab] = useState<'wordList' | 'associations'>('wordList')

  const switchTabs = (_event: any, newValue: 'wordList' | 'associations') => {
    setTab(newValue)
  }

  useEffect(() => {
    status && setTab('associations')
  }, [status])

  //TODO: Lift state from wordList to here

  const styles = setStyles()

  return (
    <Container className={styles.root}>
      <TabContext value={tab}>
        <AppBar>
          <Toolbar className={styles.toolBar}>
            <Typography className={styles.title} variant="h6">
              Reverie
            </Typography>
            <Button>Log in</Button>
          </Toolbar>
          <TabList onChange={switchTabs} variant="fullWidth">
            <Tab label="Word lists" value="wordList" />
            <Tab label="Associations" value="associations" />
          </TabList>
        </AppBar>
        <Toolbar />
        <Toolbar />
        <TabPanel value="wordList" className={styles.wordPanel}>
          <Slide
            in={tab === 'wordList'}
            direction="right"
            unmountOnExit
            mountOnEnter
          >
            <div className={styles.transition}>
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
                      meta={wordList}
                      mobile
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
            </div>
          </Slide>
        </TabPanel>
        <TabPanel value="associations" className={styles.associations}>
          <Slide
            in={tab === 'associations'}
            direction="left"
            unmountOnExit
            mountOnEnter
          >
            <div>
              <Associations
                associations={activeWordList?.associations}
                status={status}
                filters={activeWordList?.filters}
                activeWordList={{ activeWordList, setActiveWordList }}
                wordImagesList={activeWordList?.wordImages}
                mobile
                wordLists={{wordLists, setWordLists}}
              />
              <ImageGrid
                wordImagesList={activeWordList?.wordImages}
                status={status}
                filters={activeWordList?.filters}
              />
            </div>
          </Slide>
        </TabPanel>
      </TabContext>
    </Container>
  )
}

const setStyles = makeStyles(theme => ({
  root: {
    height: '100%',
  },
  fab: {
    alignSelf: 'center',
  },
  collapsedList: {
    cursor: 'pointer',
  },
  expandedList: {
    cursor: 'default',
  },
  transition: {
    display: 'flex',
    flexDirection: 'column',
  },
  toolBar: {
    maxWidth: '91vw',
  },
  title: {
    flexGrow: 1,
    userSelect: 'none',
  },
  wordPanel: {
    padding: 0,
    height: '100%',
    marginTop: '2rem',
  },
  associations: {
    marginTop: '-5rem',
    padding: 0,
  },
}))
