import { useEffect, useState } from 'react'
import {
  Grow,
  makeStyles,
  ImageList,
  ImageListItem,
  CircularProgress,
  Container,
} from '@material-ui/core'
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
    const tempImageBytes = wordImagesList.flatMap(wordImages =>
      wordImages.images.map(image => image.bytes!)
    )
    shuffle(tempImageBytes)
    setAllImageBytes(tempImageBytes)
  }, [wordImagesList])

  const [filteredImageBytes, setFilteredImageBytes] = useState(allImageBytes)
  //Filter images by word and label filters
  useEffect(() => {
    if (filters.labels[0] || filters.words[0]) {
      const wordsFilteredImages = wordImagesList.flatMap(wordImages =>
        filters.words.every(word => word === wordImages.word.name)
          ? wordImages.images
          : []
      )

      const labelsFilteredImages = wordImagesList.flatMap(wordImages =>
        wordImages.images.filter(image =>
          filters.labels.every(label => image.labels?.includes(label))
        )
      )

      //If there were both label and word filters, return the union of their
      //results; otherwise, return the result for the existing filter
      const newFilteredImages =
        filters.words[0] && filters.labels[0]
          ? wordsFilteredImages.filter(({ url: url1 }) =>
              labelsFilteredImages.some(({ url: url2 }) => url1! === url2!)
            )
          : filters.words[0]
          ? wordsFilteredImages
          : labelsFilteredImages

      const newFilteredImageBytes = newFilteredImages.map(image => image.bytes!)

      setFilteredImageBytes(newFilteredImageBytes)
    } //If there are no filters, update filteredImageBytes with allImageBytes
    else {
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
    <Container className={styles.root}>
      {processing && !wordImagesList[0] ? (
        <>
          <div>Loading images ...</div>
          <CircularProgress />
        </>
      ) : (
        <ImageList cols={4}>
          {filteredImageBytes.map((bytes, index) => (
            <Grow in={!processing} timeout={index * 200} key={bytes.toString()}>
              <ImageListItem>
                <img src={bytesToURL(bytes)} />
              </ImageListItem>
            </Grow>
          ))}
        </ImageList>
      )}
    </Container>
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
  root: {
    marginTop: '1rem',
  },
})
