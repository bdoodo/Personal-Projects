import { useState, useEffect } from 'react'
import {
  Container,
  Chip,
  Avatar,
  createTheme,
  ThemeProvider,
  CircularProgress,
  Theme,
  makeStyles,
  createStyles,
  Typography,
  Grow,
} from '@material-ui/core'
import { orange, yellow } from '@material-ui/core/colors'
import { Check } from '@material-ui/icons'

export const Associations = ({
  associations,
  processing,
  filters: { filters, setFilters },
  wordImagesList,
}: {
  associations: Association[]
  processing: boolean
  filters: FiltersState
  wordImagesList: WordImages[]
}) => {
  const [filteredLabels, setFilteredLabels] = useState(associations)
  //Filters by words passed through filters

  //Update labels by word filters
  useEffect(() => {
    //If there are word filters
    if (filters.words[0]) {
      const newFilteredLabels = new Array<Association>()

      //For each word to filter by, find the corresponding WordImages object
      filters.words.forEach(word => {
        const matchingWordImages = wordImagesList.find(
          wordImages => wordImages.word.name === word
        )

        //Within the matching object, iterate through its labels to find matching associations to push
        matchingWordImages!.allLabels?.forEach(label => {
          const matchingAssociation = associations.find(
            association => association.name === label
          )

          newFilteredLabels.push(matchingAssociation!)
        })
      })

      setFilteredLabels(newFilteredLabels)
    } else {
      setFilteredLabels(associations)
    }
  }, [filters.words, associations])

  const [selected, setSelected] = useState(new Array<string>())

  const filterByLabel = (label: string) => {
    if (!filters.labels.includes(label)) {
      setFilters({ ...filters, labels: [...filters.labels, label] })
      setSelected([...selected, label])
    } else {
      const tempLabelFilters = filters.labels
      tempLabelFilters.splice(tempLabelFilters.indexOf(label), 1)
      setFilters({ ...filters, labels: tempLabelFilters })

      const tempSelected = selected
      tempSelected.splice(tempSelected.indexOf(label), 1)
      setSelected(tempSelected)
    }
  }

  /**Determines color for labels depending on their occurrence */
  const color = (occurrence: number) =>
    occurrence === 3 ? 'primary' : occurrence === 2 ? 'secondary' : 'default'

  const styles = useStyles()

  return (
    <>
      <Typography variant="h4" className={styles.header}>
        Associations between words
      </Typography>
      {processing && !filteredLabels[0] ? (
        <>
          <div>Loading associations ...</div>
          <CircularProgress />
        </>
      ) : (
        <Container className={styles.labels}>
          <ThemeProvider theme={theme}>
            {filteredLabels.map((label, index) => (
              <Grow in={!processing} timeout={index * 100}>
                <Chip
                  key={label.name}
                  label={label.name}
                  color={color(label.occurrences)}
                  avatar={<Avatar>{label.occurrences}</Avatar>}
                  clickable
                  onClick={() => {
                    filterByLabel(label.name)
                  }}
                  deleteIcon={selected.includes(label.name) ? <Check /> : <></>}
                  onDelete={() => {
                    filterByLabel(label.name)
                  }}
                />
              </Grow>
            ))}
          </ThemeProvider>
        </Container>
      )}
    </>
  )
}

const theme = createTheme({
  palette: {
    primary: orange,
    secondary: yellow,
  },
})

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    labels: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
    header: {
      padding: '5rem 0 1rem',
    },
  })
)
