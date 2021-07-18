import { useState, useEffect } from 'react'
import {
  Container,
  Chip,
  Avatar,
  createTheme,
  ThemeProvider,
  Theme,
  makeStyles,
  createStyles,
  Typography,
  Grow,
  IconButton,
  Collapse,
} from '@material-ui/core'
import { orange, yellow } from '@material-ui/core/colors'
import { Check, ExpandMore, ExpandLess } from '@material-ui/icons'

export const Associations = ({
  associations,
  status,
  filters: { filters, setFilters },
  wordImagesList,
}: {
  associations: Association[]
  status: string
  filters: FiltersState
  wordImagesList: WordImages[]
}) => {
  const [filteredLabels, setFilteredLabels] = useState(associations)
  const [collapsed, setCollapsed] = useState(true)
  const [selected, setSelected] = useState(new Array<string>())

  //Update labels by word filters
  useEffect(() => {
    if (filters.words[0]) {
      const matchingWordImages = wordImagesList.filter(({ word }) =>
        filters.words.some(wordFilter => wordFilter === word.name)
      )

      const newFilteredLabels = associations.filter(association =>
        matchingWordImages.every(wordImages =>
          wordImages.allLabels?.includes(association.name)
        )
      )

      //Remove disselected labels from label filters and
      //selected by passing them to filterByLabel
      selected.forEach(
        label =>
          !newFilteredLabels.some(newLabel => newLabel.name === label) &&
          filterByLabel(label)
      )

      setFilteredLabels(newFilteredLabels)
    } //If there are no filters, update filteredLabels with associations
    else {
      setFilteredLabels(associations)
    }
  }, [filters.words, associations])

  const filterByLabel = (label: string) => {
    const alreadyExists = filters.labels.includes(label)

    setFilters({
      ...filters,
      labels: !alreadyExists
        ? [...filters.labels, label]
        : filters.labels.filter(labelFilter => labelFilter !== label),
    })

    setSelected(
      !alreadyExists
        ? [...selected, label]
        : selected.filter(selectedLabel => selectedLabel !== label)
    )
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
      <Container>
        <Collapse in={!collapsed} collapsedSize="78px">
          <Container className={styles.labels}>
            <ThemeProvider theme={theme}>
              {filteredLabels.map((label, index) => (
                <Grow in={!status} timeout={index * 100} key={label.name}>
                  <Chip
                    label={label.name}
                    color={color(label.occurrences)}
                    avatar={<Avatar>{label.occurrences}</Avatar>}
                    clickable
                    onClick={() => {
                      filterByLabel(label.name)
                    }}
                    deleteIcon={
                      selected.includes(label.name) ? <Check /> : <></>
                    }
                    onDelete={() => {
                      filterByLabel(label.name)
                    }}
                  />
                </Grow>
              ))}
            </ThemeProvider>
          </Container>
        </Collapse>
        {filteredLabels.length > 10 && !status && (
          <Container className={styles.labels}>
            <IconButton
              onClick={() => {
                setCollapsed(!collapsed)
              }}
            >
              {collapsed ? <ExpandMore /> : <ExpandLess />}
            </IconButton>
          </Container>
        )}
      </Container>
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
