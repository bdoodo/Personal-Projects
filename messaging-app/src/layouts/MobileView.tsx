import {
  Container,
  Snackbar,
  Divider,
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Button,
  IconButton,
  Fab,
} from '@material-ui/core'
import { SignIn, MessageListTabs, Details } from '../components'
import { Create, ArrowBack } from '@material-ui/icons'
import { Alert } from '@material-ui/lab'
import { useState } from 'react'

export const MobileView = (props: {
  authToken: string | undefined
  setDetailsContent: React.Dispatch<
    React.SetStateAction<number | 'compose' | undefined>
  >
  signOut: () => void
  setSnackMessage: React.Dispatch<React.SetStateAction<string>>
  setAuthToken: React.Dispatch<React.SetStateAction<string | undefined>>
  detailsContent: number | 'compose' | undefined
  updateSentSwitch: boolean
  updateSentTab: React.Dispatch<React.SetStateAction<boolean>>
  snackMessage: string
  closeSnack: () => void
}) => {
  const {
    authToken,
    setDetailsContent,
    signOut,
    setSnackMessage,
    setAuthToken,
    detailsContent,
    updateSentSwitch,
    updateSentTab,
    snackMessage,
    closeSnack,
  } = props

  const [view, setView] = useState<'lists' | 'details'>('lists')

  const handleFab = () => {
    setDetailsContent('compose')
    setView('details')
  }

  const styles = setStyles()

  return (
    <Container className={styles.root}>
      <AppBar position="sticky">
        <Toolbar className={styles.prominent}>
          {view === 'details' ? (
            <IconButton edge="start" onClick={() => setView('lists')}>
              <ArrowBack />
            </IconButton>
          ) : (
            <>
              <Typography variant="h6" className={styles.title}>
                Brian's Messaging App
              </Typography>
              <Divider flexItem orientation="vertical" variant="middle" />
              <Button onClick={signOut} color="inherit">
                Sign out
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <SignIn open={!authToken} {...{ setSnackMessage, setAuthToken }} />
      {authToken &&
        (view === 'lists' ? (
          <>
            <MessageListTabs
              {...{
                authToken,
                setSnackMessage,
                setDetailsContent,
                detailsContent,
                updateSentSwitch,
                setView,
              }}
            />
            <Fab className={styles.fab}>
              <IconButton color="inherit" onClick={handleFab}>
                <Create />
              </IconButton>
            </Fab>
          </>
        ) : (
          <Details
            content={detailsContent}
            {...{
              setSnackMessage,
              authToken,
              updateSentTab,
              updateSentSwitch,
            }}
          />
        ))}
      <Snackbar
        autoHideDuration={5000}
        open={Boolean(snackMessage)}
        onClose={closeSnack}
        anchorOrigin={{
          horizontal: 'center',
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

const setStyles = makeStyles(theme => ({
  root: {
    height: '90vh',
    margin: 0,
    padding: 0,
  },
  title: {
    flexGrow: 1,
  },
  spacer: {
    flexGrow: 1,
  },
  prominent: {
    minHeight: 64,
    alignItems: 'flex-start',
    paddingTop: theme.spacing(2),
  },
  fab: {
    position: 'absolute',
    right: '3rem',
    bottom: '3rem',
  },
}))
