import React, {useState, useEffect} from 'react'
import {Flex, Button, Text} from '@fluentui/react-northstar'
import {RestaurantCard, RecipeCard} from './ItemCards'
const chunk = require('lodash.chunk')

const itemsPerPage = 10
//lists below

const RestaurantList = ({filters, location}) => {
  const [page, setPage] = useState(0)
  const [message, setMessage] = useState('Loading')
  const [search, setSearch] = useState(filters.search)

  const [results, setResults] = useState([])
  useEffect(() => {
    if (search !== filters.search || (results.length === page + 1 && results[results.length - 1].length === 10) || !results[0]) {
      try {
        if (search !== filters.search)  {
          setPage(0)
          setResults([])
          setSearch(filters.search)
        }
        fetch(`/.netlify/functions/auth-fetch?show=restaurants&filters=${JSON.stringify(filters)}&location=${JSON.stringify(location)}&from=${page*20}`)
        .then(response => response.json())
        .then(result => chunk(result.businesses, itemsPerPage))
        .then(chunkedItems => {
          if (chunkedItems.length >= 1) {
            const newResults = results.concat(chunkedItems)
            setResults(search === filters.search ? newResults : chunkedItems)

          }
          else setMessage('No results to display')
        })
      } catch (e) {
          console.error(e)
          setMessage("Uh oh ... that wasn't supposed to happen 👀")
      }
    }
  }, [filters, location, page])

  function handlePage() {
    if (this.content === 'Next page') setPage(page + 1)
    else setPage(page - 1)
  }

  return (
    <Flex column hAlign='center' gap='gap.smaller'>
      {results[page]
        ?  results[page].map((result, index) => 
            <RestaurantCard info={result} key={index} goingOut={filters.goingOut}/>
          )
        : <Text>{message}</Text>
      }
      <Flex gap='gap.large'>
        {page > 0 &&
          <>
            <Button onClick={handlePage} content='Go back'/>
            <Text weight='bold'>pp.{page + 1}</Text>
          </>
        }
        {results[page + 1] && 
          <Button onClick={handlePage} content='Next page'/>
        }
      </Flex>
    </Flex>
  )
}

const RecipeList = ({filters}) => {
  const [page, setPage] = useState(0)
  const [message, setMessage] = useState('Loading')
  const [search, setSearch] = useState(filters.search)

  const [results, setResults] = useState([])
  useEffect(() => {
    if (search !== filters.search || (results.length === page + 1 && results[results.length - 1].length === 9) || !results[0]) {
      try {
        if (search !== filters.search)  {
          setPage(0)
          setResults([])
          setSearch(filters.search)
        }
        fetch(`/.netlify/functions/auth-fetch?show=recipes&filters=${JSON.stringify(filters)}&from=${page*20}`)
        .then(response => response.json())
        .then(result => chunk(result.hits, itemsPerPage))
        .then(chunkedItems => {
          if (chunkedItems.length >= 1) {
            const newResults = results.concat(chunkedItems)
            setResults(search === filters.search ? newResults : chunkedItems)
          }
          else setMessage('No results to display')
        })
      } catch (e) {
          console.error(e)
          setMessage("Uh oh ... that wasn't supposed to happen 👀")
      }
    }
  }, [filters, page])

  function handlePage() {
    if (this.content === 'Next page') setPage(page + 1)
    else setPage(page - 1)
  }

  return (
    <Flex column hAlign='center' gap='gap.smaller'>
      {results[page]
        ?  results[page].map((result, index) =>
            <RecipeCard info={result} key={index}/>
          )
        : <Text>{message}</Text>
      }
      <Flex gap='gap.large'>
        {page > 0 &&
          <>
            <Button onClick={handlePage} content='Go back'/>
            <Text weight='bold'>pp.{page + 1}</Text>
          </>
        }
        {results[page + 1] &&
          <Button onClick={handlePage} content='Next page'/>
        }
      </Flex>
    </Flex>
  )
}

export {RestaurantList, RecipeList}