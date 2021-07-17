/* src/App.js */
import { useState, useEffect } from 'react'
import { ImageGrid, WordList, Associations } from './components'
import { Grid, Divider, makeStyles } from '@material-ui/core'
import { sortLabels } from './utils'

export const App = () => {
  const [wordImages, setWordImages] = useState(new Array<WordImages>())
  const [associations, setAssociations] = useState(new Array<Association>())
  const [processing, setProcessing] = useState(false)
  const [filters, setFilters] = useState({
    words: new Array<string>(),
    labels: new Array<string>(),
  })

  //Update associations whenever wordImages changes
  useEffect(() => {
    setAssociations(sortLabels(wordImages))
  }, [wordImages])

  const styles = setStyles()

  return (
    <Grid container spacing={5} className={styles.root}>
      <Grid item xs={5}>
        <WordList
          wordImages={{ wordImages, setWordImages }}
          filters={{ filters, setFilters }}
          processing={{processing, setProcessing}}
          setAssociations={setAssociations}
        />
      </Grid>
      <Divider orientation='vertical' className={styles.divider} />
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

const setStyles = makeStyles({
  root: {
    height: '100vh'
  },
  divider: {
    height: '60%',
    alignSelf: 'center'
  }
})