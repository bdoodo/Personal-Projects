import React, {useState, useEffect} from 'react'
import {Flex, Button, Text} from '@fluentui/react-northstar'
import {RestaurantList, RecipeList} from './ItemLists'

const ListPicker = ({location, filters}) => {
  const [selected, setSelected] = useState('restaurants')

  return (
    <>
      { /** display restaurants/recipes toggle if not going out */
        !filters.goingOut &&
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
      } 
      
      { /**call restaurant list or recipe list depending on toggle state */
        selected === 'restaurants'
          ? <>
              <Text size='larger' styles={{marginBottom: '1em'}}>Open now:</Text>
              <RestaurantList location={location} filters={filters}/>
            </>
          : <>
              <Text size='larger' styles={{marginBottom: '1em'}}>Hot in the kitchen:</Text>
              <RecipeList filters={filters}/>
            </>
      }
    </>
  )
}

export default ListPicker