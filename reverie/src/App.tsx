/* src/App.js */
import { useState } from 'react'
import { ImageGrid, WordList, Associations } from './components'
import { Grid } from '@material-ui/core'

export const App = () => {
  const [wordImages, setWordImages] = useState(new Array<WordImages>())
  const [associations, setAssociations] = useState(new Array<Association>())
  const [processing, setProcessing] = useState(false)
  const [filters, setFilters] = useState({
    words: new Array<string>(),
    labels: new Array<string>(),
  })

  return (
    <Grid container spacing = {3}>
      <Grid item xs={6}>
        <WordList
          wordImages={{wordImages, setWordImages}}
          filters={{ filters, setFilters }}
          setProcessing={setProcessing}
          setAssociations={setAssociations}
        />
      </Grid>
      <Grid item xs={6}>
        <Associations
          associations={associations}
          processing={processing}
          filters={{ filters, setFilters }}
          wordImagesList={wordImages}
        />
        <ImageGrid
          wordImagesList={wordImages}
          processing={processing}
          filters={filters}
        />
      </Grid>
    </Grid>
  )
}
