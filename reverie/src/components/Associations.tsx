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
  useMediaQuery,
  useTheme
} from '@material-ui/core'
import { orange, yellow } from '@material-ui/core/colors'
import { Check, ExpandMore, ExpandLess } from '@material-ui/icons'

export const Associations = ({
  associations,
  status,
  filters,
  activeWordList: { activeWordList, setActiveWordList },
  wordImagesList,
  mobile,
}: {
  associations: Association[] | undefined
  status: string
  filters: { words: string[]; labels: string[] } | undefined
  activeWordList: {
    activeWordList: WordList | undefined
    setActiveWordList: React.Dispatch<
      React.SetStateAction<WordList | undefined>
    >
  }
  wordImagesList: WordImages[] | undefined
  mobile?: boolean
}) => {
  const [filteredLabels, setFilteredLabels] = useState(associations)
  const [collapsed, setCollapsed] = useState(true)
  const [selected, setSelected] = useState(new Array<string>())

  //Update labels by word filters
  useEffect(() => {
    if (filters?.words[0]) {
      //Find wordImages passing word filters
      const matchingWordImages = wordImagesList?.filter(({ word }) =>
        filters?.words.some(wordFilter => wordFilter === word.name)
      )

      //Filter associations to those found in every matchingWordImages
      const newFilteredLabels = associations?.filter(association =>
        matchingWordImages?.every(wordImages =>
          wordImages.allLabels?.includes(association.name)
        )
      )

      //Remove disselected labels from label filters and
      //selected by passing them to filterByLabel
      selected.forEach(
        label =>
          newFilteredLabels?.some(newLabel => newLabel.name === label) ||
          filterByLabel(label)
      )

      setFilteredLabels(newFilteredLabels)
    } //If there are no filters, update filteredLabels with associations
    else {
      setFilteredLabels(associations)
    }
  }, [filters?.words, associations])

  const filterByLabel = (label: string) => {
    const alreadyExists = filters?.labels.includes(label)

    activeWordList &&
      setActiveWordList({
        ...activeWordList,
        filters: {
          ...activeWordList.filters,
          labels: !alreadyExists
            ? [...filters!.labels, label]
            : filters!.labels.filter(labelFilter => labelFilter !== label),
        },
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

  const theme = useTheme()
  const smallMobile = useMediaQuery('(max-width: 400px)')

  const styles = useStyles()

  return (
    <>
      <Typography variant="h4" className={styles.header}>
        {mobile ?? 'Associations between words'}
      </Typography>
      <Container>
        <Collapse in={!collapsed} collapsedSize={smallMobile ? '92px' : "78px"}>
          <Container className={styles.labels}>
            <ThemeProvider theme={theme}>
              {filteredLabels?.map((label, index) => (
                <Grow in={!status} timeout={index * 100} key={label.name}>
                  <Chip
                    label={label.name}
                    color={color(label.occurrences)}
                    avatar={<Avatar>{label.occurrences}</Avatar>}
                    size={smallMobile ? 'small' : 'medium'}
                    clickable
                    onClick={() => filterByLabel(label.name)}
                    onDelete={() => filterByLabel(label.name)}
                    deleteIcon={
                      selected.includes(label.name) ? <Check /> : <></>
                    }
                  />
                </Grow>
              ))}
            </ThemeProvider>
          </Container>
        </Collapse>
        {filteredLabels && filteredLabels.length > 10 && !status && (
          <Container className={styles.labels}>
            <IconButton onClick={() => setCollapsed(!collapsed)}>
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
