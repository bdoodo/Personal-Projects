import {useEffect} from 'react'
import {Paper, Grid, makeStyles} from '@material-ui/core'

export const ImageGrid = ({imgUrls, processing}: {imgUrls: string[], processing: boolean}) => {
  useEffect(() => {
    shuffleArray(imgUrls)
  }, imgUrls)

  const styles = setStyles()

  return (
    <>
      {processing && !imgUrls[0]
        ? 'Loading images ...'
        : <Grid container spacing={3}>
            {imgUrls.map((url, index) => (
              <Grid key={index} item xs={2}>
                <Paper className={styles.paper}>
                  <img src={url} className={styles.img} />
                </Paper>
              </Grid>
            ))}
          </Grid>
      }
    </>
  )
}

const setStyles = makeStyles({
  img: {
    maxWidth: '100%',
    borderRaius: '4px',
    objectFit: 'cover'
  },  
  paper: {
    height: '200px',
    padding: '2%',
    display: 'flex',
    justifyContent: 'center'
  }
})

/**
 * Shuffles an array in place.
 * Taken from Richard Durstenfield's implementation of the Fisher-Yates shuffle:
 * https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html
 * 
 * @param array The array to be shuffled
 */
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length
  while (currentIndex) {
    const randomIndex = Math.floor(Math.random() * currentIndex--)
    const temp = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temp
  }
}