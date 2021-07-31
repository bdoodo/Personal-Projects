import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import { useState, useEffect } from 'react'

export const MessageList = (props: {
  authToken: string
  setSnackMessage: (value: React.SetStateAction<string>) => void
  list: 'inbox' | 'sent'
  detailsContent: number | 'compose' | undefined
  setDetailsContent: React.Dispatch<
    React.SetStateAction<number | 'compose' | undefined>
  >
  updateSentSwitch?: boolean
  setView?: React.Dispatch<React.SetStateAction<'lists' | 'details'>>
}) => {
  const {
    authToken,
    setSnackMessage,
    list,
    setDetailsContent,
    detailsContent,
    updateSentSwitch,
    setView,
  } = props

  const [messages, setMessages] = useState(new Array<IndexedMessage>())
  useEffect(() => {
    //Fetch messages on render

    ;(async () => {
      try {
        const response = await fetch(
          `https://messaging-test.bixly.com/messages/${
            list === 'sent' ? 'sent/' : ''
          }`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        )

        const data = (await response.json()) as IndexedMessage[]

        setMessages(data)
      } catch (error) {
        setSnackMessage('Error getting messages: ' + error)
      }
    })()
  }, [updateSentSwitch])

  const deleteMessage = async (deletedMessage: IndexedMessage) => {
    try {
      await fetch(
        `https://messaging-test.bixly.com/messages/${deletedMessage.id}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      )

      //If this was shown in details, remove it
      if (detailsContent === deletedMessage.id) setDetailsContent(undefined)

      //Remove the deleted message from messages
      setMessages(messages.filter(message => message.id !== deletedMessage.id))
    } catch (error) {
      setSnackMessage('Error deleting message: ' + error)
    }
  }

  const selectItem = (message: IndexedMessage) => {
    setDetailsContent(message.id)

    //If this component was passed the setView prop (for mobile),
    //set the view to details
    setView && setView('details')
  }

  return (
    <List>
      {messages.map(message => (
        <ListItem button onClick={() => selectItem(message)}>
          <ListItemText
            inset
            primary={list === 'sent' ? message.receiver : message.sender}
            secondary={message.title}
          />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => deleteMessage(message)}
            >
              <Delete />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
}
