import React, {useState} from 'react'
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
        />
      </Form>
      <ListPicker location={location} filters={filters} />
    </Flex>
  )
}

const ListPicker = ({location, filters}) => {
  const [selected, setSelected] = useState('restaurants')

  return(
    <>
      <Flex gap='gap.medium' hAlign='center' styles={{marginBottom: '30px'}}>
        <Button circular content='restaurants' styles={{width: '100px'}} onClick={() => {setSelected('restaurants')}}/>
        <Button circular content='recipes' styles={{width: '70px'}} onClick={() => {setSelected('recipes')}}/>
      </Flex>
      <Text size='larger'>{selected === 'restaurants' ? 'Open now:' : 'Hot in the kitchen:'}</Text>
      <ItemList location={location} filters={filters} selected={selected}/>
    </>
  )
}

export default Results