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
import { SignIn, MessageListTabs, Details } from '../components'
import { Create } from '@material-ui/icons'
import { Alert } from '@material-ui/lab'

export const DesktopView = (props: {
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

  const styles = setStyles()

  return (
    <Container className={styles.root} maxWidth={'xl'}>
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
        <Grid container className={styles.grid} spacing={3}>
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
          <Divider flexItem orientation="vertical" />
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
    padding: 0,
    margin: 0,
  },
  grid: {
    height: '100%',
  },
  title: {
    flexGrow: 1,
  },
})
