import React from 'react'
import {Button, Flex, Text, 
  Form, FormInput, SearchIcon, FormButton,
  Card, Animation
} from '@fluentui/react-northstar'
import {useHistory, Link} from 'react-router-dom'

const images = {
  day: {
    stayingIn: 'https://i.pinimg.com/originals/9c/3b/a3/9c3ba37ed4fe401a41ba77ef3a036e6e.gif',
    goingOut: 'https://image.freepik.com/free-vector/crowd-people-practicing-activities-enjoying-leisure-street-near-city-park_74855-10550.jpg'
  },
  night: {
    stayingIn: 'https://i.pinimg.com/originals/0c/a0/dd/0ca0ddd9bf8dfee8a2c26227bf21f6b8.gif',
    goingOut: 'https://cdn.dribbble.com/users/497199/screenshots/1920576/city.gif'
  }
}


const Categories = ({filters, setFilters}) => {
  const history = useHistory()

  function setCuisine() {
    setFilters({...filters, cuisine: this.content.match(/[A-Za-z ]+/)})
  }

  return (
    <Flex column fill padding='padding.medium'>
      <Flex.Item size='size.quarter'>
        <Flex column gap="gap.large" padding='padding.medium'>
          <Text align="center" as="h1" size="large">Vegoons</Text>
          <Text as="h2">What's for {filters.course}?</Text>
        </Flex>
      </Flex.Item>
      <Flex column space='between' gap='gap.large' vAlign='stretch' styles={{marginTop: '5%'}}>
        <Animation name='slideUp' timingFunction='ease-out'>
          <Card fluid styles={{alignSelf: 'center'}}>
            <Card.Header>
              <Text as='h3'>Try a cuisine</Text>
            </Card.Header>
            <Card.Body>
              <Flex fill wrap  gap='gap.smaller' hAlign='center' styles={{height:'100px'}}>
                  <Link to='/results'>
                    <Button circular content='🍣 Japanese' onClick={setCuisine} styles={{padding: '0 0.5em'}}/>
                  </Link>
                  <Link to='/results'>
                    <Button circular content='🥡 Chinese' onClick={setCuisine} styles={{padding: '0 0.5em'}}/>
                  </Link>
                  <Link to='/results'>
                    <Button circular content='🥐 French' onClick={setCuisine} styles={{padding: '0 0.5em'}}/>
                  </Link>
                  <Link to='/results'>
                    <Button circular content='🥢 Asian' onClick={setCuisine} styles={{padding: '0 0.5em'}}/>
                  </Link>
                  <Link to='/results'>
                    <Button circular content='🥣 Southeast Asian' onClick={setCuisine} styles={{padding: '0 0.5em'}}/>
                  </Link>
              </Flex>
            </Card.Body>
          </Card>
        </Animation>
        <Animation name='slideUp' delay='0.2s' timingFunction='ease-out'>
          <Form onSubmit={() => {history.push('/results')}} styles={{opacity: 0}}>
            <FormInput 
              type="search"
              icon={<SearchIcon/>} 
              iconPosition="start" 
              styles={{textAlign: 'center'}}
              label="Or try searching something:"
              onChange={e => {setFilters({...filters, search: e.target.value})}}
            />
            <FormButton content='Search' styles={{textAlign: "center"}}/>
          </Form>
        </Animation>
      </Flex>
    </Flex>
  )
}

export default Categories