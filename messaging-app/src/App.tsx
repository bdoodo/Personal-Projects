import './App.css'
import { SignIn, MessageListTabs, Details } from './components'
import { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Snackbar,
  Divider,
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Button,
  IconButton,
} from '@material-ui/core'
import { Create } from '@material-ui/icons'
import { Alert } from '@material-ui/lab'

export default function App() {
  const [authToken, setAuthToken] = useState<string>()
  useEffect(() => {
    //Check local storage for an existing auth token

    const storedToken = localStorage.getItem('messagingAuth')
    setAuthToken(storedToken ?? undefined)
  }, [])

  //An Id of a message or 'compose'
  const [detailsContent, setDetailsContent] = useState<
    number | 'compose' | undefined
  >(undefined)

  //For displaying errors
  const [snackMessage, setSnackMessage] = useState('')
  const closeSnack = () => setSnackMessage('')

  const signOut = () => {
    setAuthToken(undefined)
    localStorage.removeItem('messagingAuth')
  }

  //Only used for updating 'sent' list when a new message is sent
  const [updateSentSwitch, updateSentTab] = useState(false)

  const styles = setStyles()

  return (
    <Container className={styles.root}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" className={styles.title}>
            Brian's Messaging App
          </Typography>
          {authToken && (
            <>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setDetailsContent('compose')}
              >
                <Create />
              </IconButton>
              <Divider flexItem orientation="vertical" variant="middle" />
              <Button onClick={signOut} color="inherit">
                Sign out
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <SignIn open={!authToken} {...{ setSnackMessage, setAuthToken }} />
      {authToken && (
        <Grid container className={styles.grid}>
          <Grid item xs={3}>
            <MessageListTabs
              {...{
                authToken,
                setSnackMessage,
                setDetailsContent,
                detailsContent,
                updateSentSwitch,
              }}
            />
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item xs={8}>
            <Details
              content={detailsContent}
              {...{
                setSnackMessage,
                authToken,
                updateSentTab,
                updateSentSwitch,
              }}
            />
          </Grid>
        </Grid>
      )}
      <Snackbar
        autoHideDuration={5000}
        open={Boolean(snackMessage)}
        onClose={closeSnack}
        anchorOrigin={{
          horizontal: !authToken ? 'center' : 'right',
          vertical: 'bottom',
        }}
      >
        <Alert severity="error" onClose={closeSnack}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

const setStyles = makeStyles({
  root: {
    height: '90vh',
  },
  grid: {
    height: '100%',
  },
  title: {
    flexGrow: 1,
  },
})
