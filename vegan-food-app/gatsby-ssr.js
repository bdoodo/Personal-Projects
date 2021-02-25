import React from "react"
import {LocationTimeProvider} from './src/contexts/timeAndLocationContext'

export const wrapRootElement = ({element}) => {
  return (
    <LocationTimeProvider>
      {element}
    </LocationTimeProvider>
  )
}