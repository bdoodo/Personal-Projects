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
  Divider,
  Snackbar,
} from '@material-ui/core'
import React, { useState } from 'react'
import { Add } from '@material-ui/icons'
import {
  WordList,
  Associations,
  ImageGrid,
  SignupForm,
  VerificationForm,
} from '../components'
import { useEffect } from 'react'
import { Auth } from 'aws-amplify'

export const DesktopView = ({
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
}: {
  status: string
  setStatus: React.Dispatch<React.SetStateAction<string>>
  wordLists: WordList[]
  setWordLists: React.Dispatch<React.SetStateAction<WordList[]>>
  makeWordList: () => Promise<void>
  activeListId: string | undefined
  setActiveListId: React.Dispatch<React.SetStateAction<string | undefined>>
  expand: (list: WordList) => void
  isActive: (list: WordList) => boolean
  user: {
    email: string | undefined
    password: string | undefined
    isSignedIn: boolean
  }
  setUser: React.Dispatch<
    React.SetStateAction<{
      email: string | undefined
      password: string | undefined
      isSignedIn: boolean
    }>
  >
  snackMessage: string
  setSnackMessage: React.Dispatch<React.SetStateAction<string>>
}) => {
  const styles = setStyles()

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  useEffect(() => {
    snackMessage !== '' && setSnackbarOpen(true)
  }, [snackMessage])

  const [signInPopup, setSignInPopup] = useState(false)
  const [verificationPopup, setVerificationPopup] = useState<{
    open: boolean
    email: string | undefined
  }>({ open: false, email: undefined })

  const handleClose = () => {
    setSignInPopup(false)
    setVerificationPopup({ ...verificationPopup, open: false })
  }

  const signOut = () => {
    Auth.signOut()
    setUser({ ...user, isSignedIn: false })
  }

  const activeWordList = wordLists.find(list => list.id === activeListId)

  return (
    <Container className={styles.root}>
      <AppBar>
        <Toolbar>
          <Typography className={styles.title} variant="h6">
            Reverie
          </Typography>
          <Button
            className={styles.signIn}
            color="inherit"
            onClick={() =>
              !user.isSignedIn ? setSignInPopup(true) : signOut()
            }
          >
            {!user.isSignedIn ? 'Sign in' : 'Sign out'}
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <SignupForm
        {...{
          user,
          setUser,
          handleClose,
          setSnackMessage,
          setVerificationPopup,
          verificationPopup,
        }}
        open={signInPopup}
      />
      <VerificationForm
        {...{
          email: verificationPopup.email!,
          open: verificationPopup.open,
          handleClose,
          setSnackMessage,
          user,
          setUser,
        }}
      />
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
                  {...{
                    status,
                    setStatus,
                    wordLists,
                    setWordLists,
                    activeListId,
                    setActiveListId,
                    meta: wordList,
                    setSnackMessage,
                    user
                  }}
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
            {...{
              associations: activeWordList?.associations,
              status,
              filters: activeWordList?.filters,
              activeListId,
              wordImagesList: activeWordList?.wordImages,
              wordLists,
              setWordLists,
            }}
          />
          <ImageGrid
            wordImagesList={activeWordList?.wordImages}
            status={status}
            filters={activeWordList?.filters}
          />
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={snackMessage}
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
      />
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
