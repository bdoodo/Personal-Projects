import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Collapse,
  Button,
  Fab,
  Grid,
  makeStyles,
  Divider
} from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { WordList, Associations, ImageGrid } from '../components'

export const DesktopView = ({
  status,
  setStatus,
  wordLists,
  setWordLists,
  makeWordList,
  activeWordList,
  setActiveWordList,
  expand,
  isActive
}: {
  status: string
  setStatus: React.Dispatch<React.SetStateAction<string>>
  wordLists: WordList[],
  setWordLists: React.Dispatch<React.SetStateAction<WordList[]>>,
  makeWordList: () => Promise<void>,
  activeWordList: WordList | undefined,
  setActiveWordList: React.Dispatch<React.SetStateAction<WordList | undefined>>,
  expand: (list: WordList) => void,
  isActive: (list: WordList) => boolean
}) => {

  const styles = setStyles()

  return (
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
            xs={4}
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
                    meta={wordList}
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
          <Grid item xs={1}>
            <Divider orientation="vertical" className={styles.divider} />
          </Grid>
          <Grid item xs={7}>
            <Associations
              associations={activeWordList?.associations}
              status={status}
              filters={activeWordList?.filters}
              activeWordList={{ activeWordList, setActiveWordList }}
              wordImagesList={activeWordList?.wordImages}
              wordLists={{wordLists, setWordLists}}
            />
            <ImageGrid
              wordImagesList={activeWordList?.wordImages}
              status={status}
              filters={activeWordList?.filters}
            />
          </Grid>
        </Grid>
      </Container>
  )
}

const setStyles = makeStyles(theme => ({
  root: {
    height: '100%',
  },
  divider: {
    height: 'calc(100vh - 64px)',
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
