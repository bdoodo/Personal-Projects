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
        let matchingImages = new Array<{
          bytes?: Uint8Array
          labels?: string[]
        }>()

        filters.labels.forEach((label, index) => {
          //On first label, add all images containing it
          if (index === 0) {
            //Find WordImages with the label to narrow search
            const matchingWordImages = wordImagesList.filter(wordImages =>
              wordImages.allLabels?.includes(label)
            )

            //Within those wordImages, push each image containing the
            //matching label to matchingImages
            matchingImages = matchingWordImages.flatMap(wordImages =>
              //An array of matching images from a wordImage
              wordImages.images.flatMap(image =>
                image.labels?.includes(label) ? [image] : []
              )
            )
          } //On all subsequent labels, filter out any images not containing them
          else {
            matchingImages = matchingImages.filter(image =>
              image.labels?.includes(label)
            )
          }
        })

        //Fill labelsFilteredImages with stringified bytes from matching images
        labelsFilteredImages = matchingImages.map(image =>
          JSON.stringify(image.bytes!)
        )
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

      const newFilteredImages = newFilteredImagesStringified.map(bytes => {
        //JSON looks something like: {1: 100, 2: 424, 3: 300 ...}
        const jsonParsed = JSON.parse(bytes)
        //Take the values of the JSON, which originally made up the Uint8Array, and construct a new one from them
        return Uint8Array.from(Object.values(jsonParsed))
      })
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

  //TODO: place images in an image grid
  return (
    <>
      {processing && !wordImagesList[0] ? (
        'Loading images ...'
      ) : (
        <Grid container spacing={3}>
          {filteredImageBytes.map((bytes, index) => (
            <Grid key={bytes.toString()} item xs={4}>
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
