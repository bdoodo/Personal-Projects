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
  Typography,
} from '@material-ui/core'
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
  const [needsVerification, setNeedsVerification] = useState(false)

  const switchTabs = (_event: any, newValue: 'signIn' | 'signUp') => {
    setTab(newValue)
  }

  const setEmail = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => setFormState({ ...formState, email: e.target.value })

  const setPassword = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => setFormState({ ...formState, password: e.target.value })

  const setVerification = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => setFormState({ ...formState, verification: e.target.value })

  const submit = async (
    type: 'sign up' | 'sign in',
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (needsVerification) {
      try {
        await Auth.confirmSignUp(formState.email, formState.verification)
        setNeedsVerification(false)
        setUser({...user, isSignedIn: true})
        handleClose()
      } catch (error) {
        setSnackMessage('Error validating your email: ' + error.code)
      }
    } else if (type === 'sign in') {
      try {
        await Auth.signIn(formState.email, formState.password)
        setUser({...user, isSignedIn: true})
        handleClose()
      } catch (error) {
        if (error.code.toLowerCase().includes('usernotconfirmed'))
          setNeedsVerification(true)
        else setSnackMessage('Error signing in: ' + error.code)
      }
    } else if (type === 'sign up') {
      try {
        await Auth.signUp({
          username: formState.email,
          password: formState.password,
        })
        setNeedsVerification(true)
      } catch (error) {
        setSnackMessage('Error signing up: ' + error.code)
      }
    }
  }

  const resendVerificationCode = async () => {
    try {
      await Auth.resendSignUp(formState.email)
      setSnackMessage('Code resent successfully')
    } catch (err) {
      setSnackMessage('Error resending code: ' + err.code)
    }
  }

  return (
    <Dialog open={Boolean(open)} onClose={handleClose}>
      <DialogTitle>Sign in</DialogTitle>
      <TabContext value={tab}>
        <TabList
          onChange={switchTabs}
          {...(mobile && { variant: 'fullWidth' })}
        >
          <Tab label="Sign in" value="signIn" />
          <Tab label="Sign up" value="signUp" />
        </TabList>
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
                {needsVerification && (
                  <>
                    <Typography>Type your verification code here:</Typography>
                    <TextField
                      variant="filled"
                      label="Verification code"
                      onChange={setVerification}
                    />
                    <Button onClick={resendVerificationCode}>
                      Resend verification code
                    </Button>
                  </>
                )}
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
                {needsVerification && (
                  <>
                    <Typography>
                      We sent you a verification code to your email. Please type
                      it here:
                    </Typography>
                    <TextField
                      variant="filled"
                      label="verification code"
                      onChange={setVerification}
                    />
                  </>
                )}
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
