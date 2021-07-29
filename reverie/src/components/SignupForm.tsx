import {
  TextField,
  Button,
  makeStyles,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Tab,
  Slide,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { TabContext, TabPanel, TabList } from '@material-ui/lab'
import { useState } from 'react'
import { Auth } from 'aws-amplify'

export const SignupForm = ({
  user,
  setUser,
  mobile,
  open,
  handleClose,
  setSnackMessage,
  setVerificationPopup,
}: {
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
  mobile?: boolean
  open?: boolean
  handleClose: () => void
  setSnackMessage: React.Dispatch<React.SetStateAction<string>>
  setVerificationPopup: React.Dispatch<
    React.SetStateAction<{
      open: boolean
      email: string | undefined
    }>
  >
}) => {
  const styles = makeStyles({
    dialogContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '130px',
    },
  })()

  const [formState, setFormState] = useState({
    email: '',
    password: '',
    verification: '',
  })
  const [tab, setTab] = useState<'signUp' | 'signIn'>('signIn')

  const switchTabs = (_event: any, newValue: 'signIn' | 'signUp') => {
    setTab(newValue)
  }

  const setEmail = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => setFormState({ ...formState, email: e.target.value })

  const setPassword = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => setFormState({ ...formState, password: e.target.value })

  const submit = async (
    type: 'sign up' | 'sign in',
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (type === 'sign in') {
      try {
        await Auth.signIn(formState.email, formState.password)
        setUser({ ...user, isSignedIn: true })
        handleClose()
      } catch (error) {
        if (error.code.toLowerCase().includes('usernotconfirmed')) {
          handleClose()
          setVerificationPopup({ email: formState.email, open: true })
        } else {
          setSnackMessage('Error signing in: ' + error.code)
        }
      }
    } else if (type === 'sign up') {
      try {
        await Auth.signUp({
          username: formState.email,
          password: formState.password,
        })
        handleClose()
        setVerificationPopup({ email: formState.email, open: true })
      } catch (error) {
        setSnackMessage('Error signing up: ' + error.code)
      }
    }
  }

  return (
    <Dialog open={Boolean(open)} onClose={handleClose} fullScreen={mobile}>
      <TabContext value={tab}>
        {mobile && (
          <>
            <AppBar>
              <Toolbar>
                <IconButton onClick={handleClose}>
                  <Close />
                </IconButton>
              </Toolbar>
              <TabList
                onChange={switchTabs}
                {...(mobile && { variant: 'fullWidth' })}
              >
                <Tab label="Sign in" value="signIn" />
                <Tab label="Sign up" value="signUp" />
              </TabList>
            </AppBar>
            <Toolbar />
            <Toolbar />
          </>
        )}
        {!mobile && (
          <>
            <DialogTitle>Sign in</DialogTitle>
            <TabList
              onChange={switchTabs}
              {...(mobile && { variant: 'fullWidth' })}
            >
              <Tab label="Sign in" value="signIn" />
              <Tab label="Sign up" value="signUp" />
            </TabList>
          </>
        )}
        <TabPanel value="signIn">
          <Slide
            in={tab === 'signIn'}
            direction="right"
            unmountOnExit
            mountOnEnter
          >
            <form onSubmit={e => submit('sign in', e)}>
              <DialogContent className={styles.dialogContent}>
                <TextField variant="filled" label="Email" onChange={setEmail} />
                <TextField
                  variant="filled"
                  label="Password"
                  onChange={setPassword}
                />
              </DialogContent>
              <DialogActions>
                <Button type="submit">Log in</Button>
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </form>
          </Slide>
        </TabPanel>
        <TabPanel value="signUp">
          <Slide
            in={tab === 'signUp'}
            direction="left"
            unmountOnExit
            mountOnEnter
          >
            <form onSubmit={e => submit('sign up', e)}>
              <DialogContent className={styles.dialogContent}>
                <TextField variant="filled" label="Email" onChange={setEmail} />
                <TextField
                  variant="filled"
                  label="Password"
                  onChange={setPassword}
                />
              </DialogContent>
              <DialogActions>
                <Button type="submit">Sign up</Button>
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </form>
          </Slide>
        </TabPanel>
      </TabContext>
    </Dialog>
  )
}
