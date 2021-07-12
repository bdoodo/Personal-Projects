import React, {useEffect} from 'react'
import {Paper, Grid} from '@material-ui/core'

export const ImageGrid = ({imgUrls}: {imgUrls: string[]}) => {
  useEffect(() => {
    shuffleArray(imgUrls)
  }, [])

  return (
    <Grid container spacing={3}>
    {
      imgUrls.map((url, index) => (
        <Grid key={index} item xs={3}>
          <Paper>
            <img src={url} />
          </Paper>
        </Grid>
      ))
    }
    </Grid>
  )
}

/**
 * Shuffles an array in place.
 * Taken from Richard Durstenfield's implementation of the Fisher-Yates shuffle:
 * https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html
 * 
 * @param array The array to be shuffled
 */
export const shuffleArray = (array: any[]) => {
  let currentIndex = array.length
  while (currentIndex) {
    const randomIndex = Math.floor(Math.random() * currentIndex--)
    const temp = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temp
  }
}