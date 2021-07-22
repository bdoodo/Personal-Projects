import { useEffect, useState } from 'react'
import {
  Grow,
  makeStyles,
  ImageList,
  ImageListItem,
  CircularProgress,
  Container,
  Typography,
} from '@material-ui/core'
import { shuffle } from '../utils'

export const ImageGrid = ({
  wordImagesList,
  status,
  filters,
}: {
  wordImagesList: WordImages[] | undefined
  status: string
  filters: { words: string[]; labels: string[] } | undefined
}) => {
  const [allImages, setAllImages] = useState(
    new Array<{
      title: string
      url: string
      bytes?: Uint8Array
      bytesUrl?: string
      labels?: string[]
    }>()
  )
  //Extract all image bytes from each WordImages object
  useEffect(() => {
    wordImagesList !== undefined &&
      setAllImages(
        shuffle(wordImagesList.flatMap(wordImages => wordImages.images))
      )
  }, [wordImagesList])

  const [filteredImages, setFilteredImages] = useState(allImages)
  //Filter images by word and label filters
  useEffect(() => {
    if (filters?.labels[0] || filters?.words[0]) {
      const wordsFilteredImages = wordImagesList?.flatMap(wordImages =>
        filters?.words.some(word => word === wordImages.word.name)
          ? wordImages.images
          : []
      )

      const labelsFilteredImages = wordImagesList?.flatMap(wordImages =>
        wordImages.images.filter(image =>
          filters?.labels.some(label => image.labels?.includes(label))
        )
      )

      //If there were both label and word filters, return the union of their
      //results; otherwise, return the result for the existing filter
      const newFilteredImages =
        filters?.words[0] && filters?.labels[0]
          ? wordsFilteredImages?.filter(({ url: url1 }) =>
              labelsFilteredImages?.some(({ url: url2 }) => url1! === url2!)
            )
          : filters?.words[0]
          ? wordsFilteredImages
          : labelsFilteredImages

      newFilteredImages && setFilteredImages(newFilteredImages)
    } //If there are no filters, update filteredImages with allImageBytes
    else {
      setFilteredImages(shuffle(allImages))
    }
  }, [filters, allImages])

  const styles = setStyles()

  return (
    <Container className={styles.root}>
      {status ? (
        <Container className={styles.loading}>
          <CircularProgress className={styles.dark} />
          <Typography variant="h6" className={styles.dark}>
            {status}
          </Typography>
        </Container>
      ) : !allImages[0] ? (
        <Container className={styles.loading}>
          <Typography color='secondary' variant="h5">Try adding some words!</Typography>
        </Container>
      ) : (
        <ImageList cols={4}>
          {filteredImages.map((image, index) => (
            <Grow in={!status} timeout={index * 200} key={image.url!}>
              <ImageListItem>
                <img src={image.bytesUrl!} alt={image.title} />
              </ImageListItem>
            </Grow>
          ))}
        </ImageList>
      )}
    </Container>
  )
}

const setStyles = makeStyles(theme => ({
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
    height: 'min(100%, 300px)',
  },
  loading: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    '& > *': {
      margin: '1rem 0',
    },
  },
  dark: {
    color: theme.palette.primary.dark
  }
}))
