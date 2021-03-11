import React, {useState, useEffect} from 'react'
import {Flex, Button, Text} from '@fluentui/react-northstar'
import {RestaurantCard, RecipeCard} from './ItemCards'
const chunk = require('lodash.chunk')

const ItemList = ({filters, location, selected}) => {
  const itemsPerPage = 10
  const [page, setPage] = useState(0)

  const [results, setResults] = useState([])
  const [message, setMessage] = useState('Loading')
  useEffect(() => {
    fetch(`/.netlify/functions/auth-fetch?show=${selected}&filters=${JSON.stringify(filters)}&location=${JSON.stringify(location)}`)
      .then(response => response.json())
      .then(result => chunk(result.businesses || result.hits, itemsPerPage))
      .then(chunkedItems => {
        if (chunkedItems.length >= 1) setResults(chunkedItems)
        else setMessage('No results to display')
      })
    .catch(e => {
      console.error(e)
      setMessage("Uh oh ... that wasn't supposed to happen 👀")
    })

    return setResults([])
  }, [selected, filters.search, location])

  function handlePage(next) {
    if (next) setPage(page + 1)
    else setPage(page - 1)
  }

  return (
    <Flex column hAlign='center' gap='gap.smaller'>
      {results[page] ? 
        results[page].map((result, index) =>
          selected === 'restaurants' ?
            <RestaurantCard info={result} key={index} goingOut={filters.goingOut}/>
            : <RecipeCard info={result} key={index}/>
        )
        : <Text>{message}</Text>
      }
      <Flex gap='gap.large'>
        {page > 0 ? 
          <Button onClick={() => {handlePage(false)}} content='Go back'/>
          : null
        }
        {results[page + 1] ? 
          <Button onClick={() => {handlePage(true)}} content='Next page'/>
          : null
        }
      </Flex>
    </Flex>
  )
}

export default ItemList