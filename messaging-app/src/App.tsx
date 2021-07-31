import './App.css'
import { useState, useEffect } from 'react'
import { DesktopView, MobileView } from './layouts'
import { useMediaQuery, useTheme } from '@material-ui/core'

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

  const theme = useTheme()
  //'md' is 960px; anything narrower is considered mobile
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const layoutResources = {
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
  }

  return (
    <>
      {isMobile ? (
        <MobileView {...layoutResources} />
      ) : (
        <DesktopView {...layoutResources} />
      )}
    </>
  )
}
