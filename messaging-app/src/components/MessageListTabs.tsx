import { Tab } from '@material-ui/core'
import { TabList, TabContext, TabPanel } from '@material-ui/lab'
import { useState } from 'react'
import { MessageList } from './'

export const MessageListTabs = (props: {
  authToken: string
  setSnackMessage: (value: React.SetStateAction<string>) => void
  setDetailsContent: React.Dispatch<
    React.SetStateAction<number | 'compose' | undefined>
  >
  detailsContent: number | 'compose' | undefined
  updateSentSwitch: boolean
  setView?: React.Dispatch<React.SetStateAction<'lists' | 'details'>>
}) => {
  const {
    authToken,
    setSnackMessage,
    setDetailsContent,
    detailsContent,
    updateSentSwitch,
    setView,
  } = props

  const [tab, setTab] = useState<'inbox' | 'sent'>('inbox')
  const changeTab = (
    _event: React.ChangeEvent<{}>,
    newTab: 'inbox' | 'sent'
  ) => {
    setDetailsContent(undefined)
    setTab(newTab)
  }

  return (
    <TabContext value={tab}>
      <TabList onChange={changeTab} aria-label="Message folders">
        <Tab label="Inbox" value="inbox" />
        <Tab label="Sent" value="sent" />
      </TabList>
      <TabPanel value="inbox">
        <MessageList
          list="inbox"
          {...{
            authToken,
            setSnackMessage,
            setDetailsContent,
            detailsContent,
            setView,
          }}
        />
      </TabPanel>
      <TabPanel value="sent">
        <MessageList
          list="sent"
          {...{
            authToken,
            setSnackMessage,
            setDetailsContent,
            detailsContent,
            updateSentSwitch,
            setView,
          }}
        />
      </TabPanel>
    </TabContext>
  )
}
