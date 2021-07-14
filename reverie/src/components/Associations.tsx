import { useState, useEffect } from 'react'
import {
  Container,
  Chip,
  Avatar,
  createTheme,
  ThemeProvider,
} from '@material-ui/core'
import { orange, red } from '@material-ui/core/colors'

export const Associations = ({
  associationList,
  processing,
  filtersState: { filters, setFilters },
  wordImagesList,
}: {
  associationList: Association[]
  processing: boolean
  filtersState: FiltersState
  wordImagesList: WordImages[]
}) => {
  const [filteredLabels, setFilteredLabels] = useState(associationList)
  //Filters by words passed through filters
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
          const matchingAssociation = associationList.find(
            association => association.name === label
          )

          newFilteredLabels.push(matchingAssociation!)
        })
      })

      setFilteredLabels(newFilteredLabels)
    }
  }, [filters.words])

  const filterByLabel = (label: string) => {
    setFilters({ ...filters, labels: [...filters.labels, label] })
  }

  /**Determines color for labels depending on their occurrence */
  const color = (occurrence: number) =>
    occurrence === 3 ? 'primary' : occurrence === 2 ? 'secondary' : 'default'

  return (
    <>
      <h2>Associations between words</h2>
      {processing && !filteredLabels[0] ? (
        'Loading associations ...'
      ) : (
        <Container>
          <ThemeProvider theme={theme}>
            {filteredLabels.map(label => (
              <Chip
                key={label.name}
                label={label.name}
                color={color(label.occurrences)}
                avatar={<Avatar>{label.occurrences}</Avatar>}
                onClick={() => {
                  filterByLabel(label.name)
                }}
              />
            ))}
          </ThemeProvider>
        </Container>
      )}
    </>
  )
}

const theme = createTheme({
  palette: {
    primary: red,
    secondary: orange,
  },
})
