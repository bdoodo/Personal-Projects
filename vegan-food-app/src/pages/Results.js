import React, {useState, useEffect} from 'react'
import { Button, UndoIcon, Form, FormInput, SearchIcon, Flex, Text } from '@fluentui/react-northstar'
import ListPicker from '../components/ListPicker'

const Results = ({filters, location, setFilters}) => {
  //clean up search and cuisine on unmount
  useEffect(() => {
    return () => {
      setFilters({...filters, search: '', cuisine: ''})
    }
  }, [])

  const [search, setSearch] = useState(filters.search)

  return (
    <Flex column>
      <Button 
        circular 
        icon={<UndoIcon/>} 
        styles={{position: 'absolute', top: '20px', left: '20px'}}
        onClick={() => {window.history.back()}}
      />
      <Form 
        styles={{ marginBottom: '30px', position: 'relative', left: '60px', width: '80%'}} 
        onSubmit={() => {setFilters({...filters, search: search})}}
      >
        <FormInput 
          type='search'
          icon={<SearchIcon/>} 
          iconPosition="start" 
          fluid
          defaultValue= {filters.search}
          onChange={e => {setSearch(e.target.value)}}
        />
      </Form>
      <ListPicker location={location} filters={filters} setFilters={setFilters}/>
    </Flex>
  )
}

export default Results