import React, {useState, useEffect} from 'react'
import {Flex, Button, Text} from '@fluentui/react-northstar'
import {RestaurantCard, RecipeCard} from './ItemCards'
const chunk = require('lodash.chunk')

const ItemList = ({filters, location, selected}) => {
  const itemsPerPage = 10
  const [page, setPage] = useState(0)

  const [results, setResults] = useState([])
  useEffect(() => {
    fetch(`/.netlify/functions/auth-fetch?show=${selected}&filters=${JSON.stringify(filters)}&location=${JSON.stringify(location)}`)
      .then(response => response.json())
      .then(result => chunk(result.businesses || result.hits, itemsPerPage))
      .then(chunkedItems => {
        setResults(chunkedItems)
      })
      return (
        setResults([])
      )
  }, [selected])

  function nextPage() {
    setPage(page + 1)
  }

  return (
    <Flex column hAlign='center' gap='gap.smaller'>
      {results[page] ? 
        results[page].map((result, index) =>
          selected === 'restaurants' ?
            <RestaurantCard info={result} key={index}/>
            : <RecipeCard info={result} key={index}/>
        )
        : <Text>Loading</Text>
      }
      <Button onClick={nextPage} content='Show more'/>
    </Flex>
  )
}

export default ItemList