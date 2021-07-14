import { useEffect, useState } from 'react'
import { Paper, Grid, makeStyles } from '@material-ui/core'
import { shuffle } from '../utils'

export const ImageGrid = ({
  wordImagesList,
  processing,
  filters,
}: {
  wordImagesList: WordImages[]
  processing: boolean
  filters: { words: string[]; labels: string[] }
}) => {
  const [allImageBytes, setAllImageBytes] = useState(new Array<Uint8Array>())
  //Extract all image bytes from each WordImages object
  useEffect(() => {
    const tempImageBytes = new Array<Uint8Array>()
    for (const { images } of wordImagesList) {
      images.forEach(image => {
        image.bytes &&
          tempImageBytes.push(image.bytes)
      })
    }
    shuffle(tempImageBytes)
    setAllImageBytes(tempImageBytes)
  }, wordImagesList)

  const [filteredImageBytes, setFilteredImageBytes] = useState(allImageBytes)
  //Filter images by word and label filters
  useEffect(() => {
    let newFilteredImages = new Array<Uint8Array>()
    if (filters.words[0]) {
      filters.words.forEach(word => {
        const matchingWordImages = wordImagesList.find(
          wordImages => wordImages.word.name === word
        )

        newFilteredImages = filteredImageBytes.filter(bytes => {
          //TODO: create a list of all bytes per wordImages, then filter imageBytes by it
        })
      })
    }
  }, [filters])

  const bytesToURL = (bytes: Uint8Array) => {
    const blob = new Blob([bytes.buffer])
    return URL.createObjectURL(blob)
  }

  const styles = setStyles()

  return (
    <>
      {processing && !wordImagesList[0] ? (
        'Loading images ...'
      ) : (
        <Grid container spacing={3}>
          {allImageBytes.map((bytes, index) => (
            <Grid key={index} item xs={2}>
              <Paper className={styles.paper}>
                <img src={bytesToURL(bytes)} className={styles.img} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}

const setStyles = makeStyles({
  img: {
    maxWidth: '100%',
    borderRaius: '4px',
    objectFit: 'cover',
  },
  paper: {
    height: '200px',
    padding: '2%',
    display: 'flex',
    justifyContent: 'center',
  },
})
