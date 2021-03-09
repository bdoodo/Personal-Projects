import React, {useState, useEffect} from 'react'

const ItemList = ({filters, location, selected}) => {
  const {latitude, longitude} = location

  const [display, setDisplay] = useState([])
  useEffect(() => {
    if (selected === 'restaurants') {
      fetch(`/.netlify/functions/auth-fetch?show=restaurants&filters=${filters}&location=${location}`)
      .then(response => response.json())
      .then(result => {console.log(result)})
    } else {
      fetch(`/.netlify/functions/auth-fetch?show=recipes&cuisineType=${}&mealType=${}&q=${}`)
      .then(response => response.json())
      .then(result => {console.log(result)})
    }
    //TODO: fill in variables above, separate search queries into separate words w/ + or %20
  }, [filters, selected])

  return(
    null
  )
}

export default ItemList

/*variables I need:
  for edamam:
    cuisineType
    mealType (lunch, dinner, breakfast)
    q (query)
    -------------
    full dictionary here: https://developer.edamam.com/edamam-docs-recipe-api

  for Yelp:
    possibly autocomplete
    search
    location
    -------------
    https://www.yelp.com/developers/documentation/v3/get_started

  additionally, for my own API:
    display
*/