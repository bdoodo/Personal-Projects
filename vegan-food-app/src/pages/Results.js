import React, {useState, useEffect} from 'react'
import { Button, UndoIcon, Form, FormInput, SearchIcon, Flex, Text } from '@fluentui/react-northstar'
import ItemList from '../components/ItemList'

const Results = ({filters, addFilters, location}) => {
  return (
    <Flex column>
      <Button 
        circular 
        icon={<UndoIcon/>} 
        styles={{position: 'absolute', top: '20px', left: '20px'}}
        onClick={() => {window.history.back()}}
      />
      <Form styles={{ marginBottom: '30px', position: 'relative', left: '60px', width: '80%'}}>
        <FormInput 
          type='search'
          icon={<SearchIcon/>} 
          iconPosition="start" 
          fluid
          defaultValue= {filters.search}
          onChange={e => {addFilters({search: e.target.value})}}
        />
      </Form>
      <ListPicker location={location} filters={filters} addFilters={addFilters}/>
    </Flex>
  )
}

const ListPicker = ({location, filters, addFilters}) => {
  const randomSearches = ['soup', 'noodles', 'rice', 'spicy', 'sour', 'hot']
  const randomNumber = ceil => Math.round(Math.random() * ceil)

  const [selected, setSelected] = useState('restaurants')
  useEffect(() => {
    if (selected === 'recipes' && !filters.search) {
      addFilters({search: randomSearches[randomNumber(randomSearches.length)]})
    }
  }, [selected])

  return(
    <>
      {!filters.goingOut ? 
        <Flex gap='gap.medium' hAlign='center' styles={{marginBottom: '30px'}}>
          <Button circular content='restaurants' styles={{width: '100px'}} onClick={() => {setSelected('restaurants')}}/>
          <Button circular content='recipes' styles={{width: '70px'}} onClick={() => {setSelected('recipes')}}/>
        </Flex>
        : null
      }
      <Text size='larger' styles={{marginBottom: '1em'}}>{selected === 'restaurants' ? 'Open now:' : 'Hot in the kitchen:'}</Text>
      <ItemList location={location} filters={filters} selected={selected}/>
    </>
  )
}

export default Results