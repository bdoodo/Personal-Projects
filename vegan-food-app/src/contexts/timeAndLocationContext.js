import React, { useEffect, useState } from "react"
import moment from "moment-timezone"

//make React default context to store user location and local time
const LocationTimeContext = React.createContext({})

export const LocationTimeProvider = ({children}) => {

  //get location
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0
  })
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(findLocation)
    }

    function findLocation(pos) {
      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      })
    }
  })

  //get local time
  const [time, setTime] = useState(0)
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const currentTime = moment().tz(timezone).format()

    setTime(currentTime)
  }, [])

  //return Provider using context
  return (
    <LocationTimeContext.Provider value={{
      latitude: location.latitude,
      longitude: location.longitude,
      time: time
    }}>
      {children}
    </LocationTimeContext.Provider>
  )
}

export default LocationTimeContext