import { useState } from 'react'

//This component creates an HTML img node then returns 
//it once it finishes loading. This avoids the jarring screen paint

export const LazyImage = (props: {
  src: string
  width: number
  height: number
  classes: string | undefined
}) => {
  const { src, width, height, classes } = props

  const [imgLoaded, setImgLoaded] = useState(false)

  const image = new Image(width, height)
  image.src = src

  image.onload = () => setImgLoaded(true)

  return <>{imgLoaded && <img src={src} className={classes} />}</>
}

