import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  makeStyles,
  Slide,
} from '@material-ui/core'
import { useState } from 'react'

export const SignIn = (props: {
  open: boolean
  setSnackMessage: React.Dispatch<React.SetStateAction<string>>
  setAuthToken: React.Dispatch<React.SetStateAction<string | undefined>>
}) => {
  const { open, setSnackMessage, setAuthToken } = props

  const [formState, setFormState] = useState({ username: '', password: '' })
  const updateForm = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: 'username' | 'password'
  ) => {
    const update = JSON.parse(`{
      "${field}": "${event?.target.value}"
    }`)

    setFormState({ ...formState, ...update })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const response = await fetch(
        'https://messaging-test.bixly.com/api-token-auth/',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            username: formState.username,
            password: formState.password,
          }),
        }
      )

      const { token } = (await response.json()) as { token: string }

      if (!token) throw 'Invalid credentials'

      setAuthToken(token)
      localStorage.setItem('messagingAuth', token)
    } catch (error) {
      setSnackMessage('Error signing in: ' + error)
    }
  }

  const styles = setStyles()

  return (
    <Dialog
      fullScreen
      disableEscapeKeyDown
      open={open}
      TransitionComponent={Slide}
    >
      <Paper className={styles.paper}>
        <DialogTitle>Sign in</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              variant="filled"
              label="Username"
              required
              autoFocus
              onChange={e => updateForm(e, 'username')}
            />
            <TextField
              variant="filled"
              label="Password"
              required
              type="password"
              onChange={e => updateForm(e, 'password')}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Paper>
    </Dialog>
  )
}

const setStyles = makeStyles({
  paper: {
    maxWidth: '20rem',
    margin: '3rem auto',
  },
})
