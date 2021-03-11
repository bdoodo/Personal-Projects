import React from 'react'
import {Button, UndoIcon, Flex, Image, Text, 
  Form, FormInput, SearchIcon, FormButton,
  Card
} from '@fluentui/react-northstar'
import { useHistory, Link } from 'react-router-dom'

const images = {
  day: {
    stayingIn: 'https://i.pinimg.com/originals/9c/3b/a3/9c3ba37ed4fe401a41ba77ef3a036e6e.gif',
    goingOut: 'https://image.freepik.com/free-vector/people-walking-along-street-city-park_74855-7808.jpg'
  },
  night: {
    stayingIn: 'https://i.pinimg.com/originals/0c/a0/dd/0ca0ddd9bf8dfee8a2c26227bf21f6b8.gif',
    goingOut: 'https://cdn.dribbble.com/users/497199/screenshots/1920576/city.gif'
  }
}


const Categories = ({filters, addFilters, hours}) => {
  const dayOrNight = hours > 16 ? 'night' : 'day'
  const history = useHistory()

  return (
    <Flex column fill>
      <Flex.Item size='size.quarter'>
        <div>
          <Button 
            circular 
            icon={<UndoIcon/>} 
            styles={{position: 'absolute', top: '20px', left: '20px'}}
            onClick={() => {window.history.back()}}
          />
          <Image 
            fluid 
            src={filters.goingOut ? 
              images[`${dayOrNight}`].goingOut 
              : images[`${dayOrNight}`].stayingIn}
          />
        </div>
      </Flex.Item>
      <Flex column space='between' gap='gap.large' vAlign='stretch' styles={{marginTop: '5%'}}>
        <Card fluid styles={{alignSelf: 'center'}}>
          <Card.Header>
            <Text as='h2'>Feeling Saucy?</Text>
          </Card.Header>
          <Card.Body>
            <Flex fill wrap  gap='gap.smaller' hAlign='center' styles={{height:'100px'}}>
              <Link to='/results'>
                <Button circular content='🍣 Japanese' onClick={() => {addFilters({cuisine: 'japanese'})}}/>
              </Link>
              <Link to='/results'>
                <Button circular content='🥡 Chinese' onClick={() => {addFilters({cuisine: 'chinese'})}}/>
              </Link>
              <Link to='/results'>
                <Button circular content='🥐 French' onClick={() => {addFilters({cuisine: 'french'})}}/>
              </Link>
              <Link to='/results'>
                <Button circular content='🥢 Asian' onClick={() => {addFilters({cuisine: 'asian'})}}/>
              </Link>
              <Link to='/results'>
                <Button circular content='🥣 Southeast Asian' onClick={() => {addFilters({cuisine: 'south east asian'})}}/>
              </Link>
            </Flex>          
          </Card.Body>
        </Card>
        <Form onSubmit={() => {history.push('/results')}}>
          <FormInput 
            type="search"
            icon={<SearchIcon/>} 
            iconPosition="start" 
            styles={{textAlign: 'center'}}
            label="Or try searching something:"
            onChange={e => {addFilters({search: e.target.value})}}
          />
          <FormButton content='Search' styles={{textAlign: "center"}}/>
        </Form>
      </Flex>
    </Flex>
  )
}

export default Categories