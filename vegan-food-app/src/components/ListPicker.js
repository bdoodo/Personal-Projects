import React, {useState, useEffect} from 'react'
import {Flex, Button, Text} from '@fluentui/react-northstar'
import ItemList from './ItemList'

const ListPicker = ({location, filters}) => {
  const [selected, setSelected] = useState('restaurants')

  return (
    <>
      {!filters.goingOut ? 
        <Flex gap='gap.medium' hAlign='center' styles={{marginBottom: '30px'}}>
          <Button 
            circular 
            content='restaurants' 
            styles={{width: '100px'}} 
            onClick={() => {setSelected('restaurants')}}
            primary={selected === 'restaurants' ? true : false}
          />
          <Button 
            circular 
            content='recipes' 
            styles={{width: '70px'}} 
            onClick={() => {setSelected('recipes')}}
            primary={selected === 'recipes' ? true : false}
          />
        </Flex>
        : null
      }
      <Text size='larger' styles={{marginBottom: '1em'}}>{selected === 'restaurants' ? 'Open now:' : 'Hot in the kitchen:'}</Text>
      <ItemList location={location} filters={filters} selected={selected}/>
    </>
  )
}

export default ListPicker