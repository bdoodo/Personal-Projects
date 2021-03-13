import React from 'react'
import { Card, Image, Text, Flex } from '@fluentui/react-northstar'
import { Link } from 'react-router-dom'

import dayHouse from '../assets/card-images/day-house.svg'
import nightCity from '../assets/card-images/night-city.png'

const Onboarding = ({hours, setFilters, filters}) => {
  const timeOfDay = hours <= 10 ? 'breakfast'
    : hours <= 15 ? 'lunch' 
    : 'dinner'

    const cardImages = {
      night: {
        stayingIn: 'https://i.pinimg.com/originals/85/2a/6a/852a6a539530feca6b0b6987f9431d14.png',
        goingOut: nightCity
      },
      day: {
        stayingIn: dayHouse,
        goingOut: 'https://media.istockphoto.com/vectors/futuristic-city-day-vector-id1087611152?k=6&m=1087611152&s=170667a&w=0&h=cs1HrfXMwwds0kfX82J0ntP5a4cfgbbpR0GS709yBTE='
      }
    }
    function getImage(inOut) {
      return timeOfDay === 'dinner'
        ? cardImages.night[`${inOut}`]
        : cardImages.day[`${inOut}`]
    }

  return (
    <>
      <Flex column gap="gap.large" styles={{marginBottom: '50px'}} padding='padding.medium'>
        <Text align="center" as="h1" size="large">Vegoons</Text>
        <Text as="h2">What's for {timeOfDay}?</Text>
      </Flex>
      <Flex hAlign='center'>
        <Flex column gap="gap.small">
          <Link to='/categories' style={{textDecoration: 'none'}}>
            <Card 
              elevated 
              aria-roledescription="card for going out" 
              onClick={() => {setFilters({...filters, goingOut: true})}}
            >
              <Card.Header>
                <Text size="large">{timeOfDay === 'dinner' ? 'Night out,' : 'Going out,'}</Text>
              </Card.Header>
              <Card.Body fitted>
                <Image src={getImage('goingOut')} fluid/>
              </Card.Body>
            </Card>
          </Link>
          <Text align="center" size="large">or</Text>
          <Link to='/categories' style={{textDecoration: 'none'}}>
            <Card 
              elevated 
              aria-roledescription="card for staying in" 
              onClick={() => {setFilters({...filters, goingOut: false})}}
            >
              <Card.Header>
                <Text size="large">{timeOfDay === 'dinner' ? 'night in?' : 'staying in?'}</Text>
              </Card.Header>
              <Card.Body fitted styles={{maxHeight: '200px', overflow: 'hidden'}}>
                <Image src={getImage('stayingIn')} fluid styles={{position: 'relative'}}/>
              </Card.Body>
            </Card>
          </Link>
        </Flex>
      </Flex>
    </>
  )
}

export default Onboarding