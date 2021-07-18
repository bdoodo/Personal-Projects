/* src/App.js */
import { useState, useMemo } from 'react'
import { ImageGrid, WordList, Associations } from './components'
import {
  Grid,
  Divider,
  makeStyles,
  createTheme,
  ThemeProvider,
  useMediaQuery,
  Container,
} from '@material-ui/core'

export const App = () => {
  const [wordImages, setWordImages] = useState(new Array<WordImages>())
  const [associations, setAssociations] = useState(new Array<Association>())
  const [status, setStatus] = useState('')
  const [filters, setFilters] = useState({
    words: new Array<string>(),
    labels: new Array<string>(),
  })

  const styles = setStyles()

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  )

  return (
    <ThemeProvider theme={theme}>
      <Container className={styles.root}>
        <Grid container spacing={5}>
          <Grid item xs={5}>
            <WordList
              wordImages={{ wordImages, setWordImages }}
              filters={{ filters, setFilters }}
              status={{ status, setStatus }}
              setAssociations={setAssociations}
            />
          </Grid>
          <Divider orientation="vertical" className={styles.divider} />
          <Grid item xs={6}>
            <Associations
              associations={associations}
              status={status}
              filters={{ filters, setFilters }}
              wordImagesList={wordImages}
            />
            <ImageGrid
              wordImagesList={wordImages}
              status={status}
              filters={filters}
            />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

const setStyles = makeStyles(theme => ({
  root: {
    height: '100vh'
  },
  divider: {
    height: '60%',
    alignSelf: 'center',
  },
}))

const lightTheme = createTheme()
