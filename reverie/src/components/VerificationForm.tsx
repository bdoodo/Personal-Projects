import {
  TextField,
  Button,
  makeStyles,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  AppBar,
  Toolbar,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { useState } from 'react'
import { Auth } from 'aws-amplify'

export const VerificationForm = ({
  email,
  open,
  handleClose,
  setSnackMessage,
  user,
  setUser,
  mobile,
}: {
  email: string
  open: boolean | undefined
  handleClose: () => void
  setSnackMessage: (value: React.SetStateAction<string>) => void
  user: {
    email: string | undefined
    password: string | undefined
    isSignedIn: boolean
  }
  setUser: (
    value: React.SetStateAction<{
      email: string | undefined
      password: string | undefined
      isSignedIn: boolean
    }>
  ) => void
  mobile?: boolean
}) => {
  const [code, setCode] = useState('')

  const resendVerificationCode = async () => {
    try {
      await Auth.resendSignUp(email)
      setSnackMessage('Code resent successfully')
    } catch (err) {
      setSnackMessage('Error resending code: ' + err.code)
    }
  }

  const handleSubmit = async () => {
    try {
      await Auth.confirmSignUp(email, code)
      setUser({ ...user, isSignedIn: true })
      handleClose()
    } catch (error) {
      setSnackMessage('Error validating your email: ' + error.code)
    }
  }

  const styles = setStyles()

  return (
    <Dialog open={Boolean(open)} onClose={handleClose} fullScreen={mobile}>
      {mobile && (
        <>
          <AppBar>
            <Toolbar>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Toolbar />
        </>
      )}
      <DialogTitle className={styles.title}>
        We sent a code to your email. Enter it to verify your account:
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            variant="filled"
            label="Your code"
            onChange={e => setCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={resendVerificationCode}>Resend code</Button>
          <Button type="submit">Verify</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const setStyles = makeStyles({
  title: {
    maxWidth: '20rem',
  },
})
