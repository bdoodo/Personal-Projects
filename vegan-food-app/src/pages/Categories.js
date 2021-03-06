import React from 'react'
import {Button, UndoIcon, Flex, Image, Text, 
  Form, FormInput, SearchIcon, FormButton
} from '@fluentui/react-northstar'

const fields = [
  {
    name: 'search',
    label: 'search',
    type: 'search'
  }
]

const Categories = ({filters, addFilters}) => {
  return (
    <Flex column fill>
      <Flex.Item size='size.quarter'>
        <div>
          <UndoIcon styles={{position: 'absolute', top:'3%', left: '5%'}} size='larger' onClick={() => {window.history.back()}}/>
          <Image fluid src='https://media.istockphoto.com/vectors/vector-illustration-of-night-urban-city-landscape-big-modern-city-vector-id908367052?k=6&m=908367052&s=612x612&w=0&h=e3acPxtQemL5VWooH2BOwwi0rKtYPiKElZZv3uZiqeQ='/>
        </div>
      </Flex.Item>
      <Flex.Item grow>
        <div>
          <Text as='h2'>Feeling Saucy?</Text>
          <Form 
            onSubmit={(e) => {
              e.preventDefault()
              addFilters()
            }} 
          >
            <FormInput icon={<SearchIcon/>} iconPosition="start" type="search" styles={{textAlign: 'center'}}></FormInput>
            <Flex styles={{alignSelf: 'center'}}>
              <FormButton/>
              <FormButton/>
              <FormButton/>
            </Flex>
            <Flex styles={{alignSelf: 'center'}}>
              <FormButton/>
              <FormButton/>
            </Flex>
            <FormButton styles={{textAlign: "center"}}/>
          </Form>
        </div>
      </Flex.Item>
    </Flex>
  )
}

export default Categories