import { useState } from 'react'

export const LazyImage = (props: {
  src: string
  width: number
  height: number
  classes: string
}) => {
  const { src, width, height, classes } = props

  const [imgLoaded, setImgLoaded] = useState(false)

  const image = new Image(width, height)
  image.src = src

  image.onload = () => setImgLoaded(true)

  return <>{imgLoaded && <img src={src} className={classes} />}</>
}
