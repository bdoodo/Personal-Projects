import { useState, useEffect } from 'react'
import { parseDate } from '../utils'
import {
  Typography,
  Container,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  IconButton,
  makeStyles
} from '@material-ui/core'
import { Send } from '@material-ui/icons'

export const Details = (props: {
  content: number | 'compose' | undefined
  setSnackMessage: React.Dispatch<React.SetStateAction<string>>
  authToken: string
  updateSentTab: React.Dispatch<React.SetStateAction<boolean>>
  updateSentSwitch: boolean
}) => {
  const { content, setSnackMessage, authToken, updateSentTab, updateSentSwitch } =
    props

  const [messageContent, setMessageContent] = useState<IndexedMessage>()
  useEffect(() => {
    //If content is a message ID, fetch message details

    if (typeof content === 'number') {
      ;(async () => {
        try {
          const response = await fetch(
            `https://messaging-test.bixly.com/messages/${content}/`
          )
          const message = (await response.json()) as IndexedMessage

          setMessageContent(message)
        } catch (error) {
          setSnackMessage('Error getting details: ' + error)
        }
      })()
    }
  }, [content])

  const [composeState, setComposeState] = useState({
    receiver: '',
    title: '',
    body: '',
  })
  const updateCompose = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: 'receiver' | 'title' | 'body'
  ) => {
    const update = JSON.parse(`{
      "${field}": "${event.target.value}"
    }`)

    setComposeState({ ...composeState, ...update })
  }

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await fetch('https://messaging-test.bixly.com/messages/', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify(composeState),
      })

      setComposeState({ receiver: '', title: '', body: '' })

      //Refresh the sent tab in case it's active
      updateSentTab(!updateSentSwitch)
    } catch (error) {
      setSnackMessage('Error sending your message: ' + error)
    }
  }

  const styles = setStyles()

  return (
    <Container className={styles.root}>
      {!content ? (
        <Typography>No message selected</Typography>
      ) : content === 'compose' ? (
        <Card>
          <form onSubmit={sendMessage}>
            <CardContent className={styles.form}>
              <TextField
                variant="outlined"
                label="To:"
                onChange={e => updateCompose(e, 'receiver')}
                value={composeState.receiver}
                required
              />
              <TextField
                variant="outlined"
                label="Subject"
                onChange={e => updateCompose(e, 'title')}
                value={composeState.title}
                required
              />
              <TextField
                variant="outlined"
                fullWidth
                multiline
                label="Message"
                onChange={e => updateCompose(e, 'body')}
                value={composeState.body}
                required
                size="medium"
              />
            </CardContent>
            <CardActions>
              <IconButton type="submit">
                <Send />
              </IconButton>
            </CardActions>
          </form>
        </Card>
      ) : (
        //If a message Id was provided
        <Card>
          <CardHeader
            title={messageContent?.title}
            subheader={messageContent && parseDate(messageContent.sent)}
          />
          <CardContent>
            <Typography>{messageContent?.body}</Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

const setStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 180 
  },
  root: {
    marginTop: 20
  }
})