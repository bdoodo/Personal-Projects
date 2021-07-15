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
        image.bytes && tempImageBytes.push(image.bytes)
      })
    }
    shuffle(tempImageBytes)
    setAllImageBytes(tempImageBytes)
  }, [wordImagesList])

  const [filteredImageBytes, setFilteredImageBytes] = useState(allImageBytes)
  //Filter images by word and label filters
  useEffect(() => {
    //Arrays of stringified bytes (stringified so we can compare them later)
    let wordsFilteredImages = new Array<string>()
    let labelsFilteredImages = new Array<string>()
    
    if (filters.labels[0] || filters.words[0]) {
      if (filters.words[0]) {
        filters.words.forEach(word => {
          //Find the wordImages whose name matches the word filter
          const matchingWordImages = wordImagesList.find(
            wordImages => wordImages.word.name === word
          )

          //Push bytes from the matching wordImages to wordsFilteredImages
          matchingWordImages!.images.forEach(image => {
            image.bytes && wordsFilteredImages.push(JSON.stringify(image.bytes))
          })
        })
      }

      if (filters.labels[0]) {
        const filteredWordNames = new Set<string>()

        filters.labels.forEach(label => {
          //find WordImages with the label filter
          const matchingWordImages = wordImagesList.filter(wordImages =>
            wordImages.allLabels?.includes(label)
          )

          //Add the WordImages' names to a set (so we don't get duplicates)
          matchingWordImages.forEach(({ word }) => {
            filteredWordNames.add(word.name)
          })
        })

        //Find wordImages from the input wordImagesList whose names match the names in the set
        const filteredWords = wordImagesList.filter(({ word }) =>
          filteredWordNames.has(word.name)
        )

        //Push the bytes from these wordImages to labelsFilteredImages
        filteredWords.forEach(wordImages => {
          wordImages.images.forEach(image => {
            image.bytes && labelsFilteredImages.push(JSON.stringify(image.bytes))
          })
        })
      }

      //If there were both label and word filters, return their union; otherwise, return the result for the existing filter
      const newFilteredImagesStringified =
        wordsFilteredImages[0] && labelsFilteredImages[0]
          ? wordsFilteredImages.filter(image =>
              labelsFilteredImages.includes(image)
            )
          : wordsFilteredImages[0]
          ? wordsFilteredImages
          : labelsFilteredImages

      const newFilteredImages = newFilteredImagesStringified.map(bytes =>
        JSON.parse(bytes)
      )
      setFilteredImageBytes(newFilteredImages)
    } else {
      setFilteredImageBytes(allImageBytes)
    }
  }, [filters, allImageBytes])

  /**Convert bytes to an object URL */
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
          {filteredImageBytes.map((bytes, index) => (
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
