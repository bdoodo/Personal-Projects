import React from 'react'
import {Button, Flex, Text, 
  Form, FormInput, SearchIcon, FormButton,
  Card, Animation, useCSS
} from '@fluentui/react-northstar'
import {useHistory, Link} from 'react-router-dom'


const Categories = ({filters, setFilters}) => {
  const history = useHistory()

  function setCuisine() {
    setFilters({...filters, cuisine: this.content.match(/[A-Za-z ]+/)})
  }

  return (
    <Flex column fill padding='padding.medium' className='page-spacing'>
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