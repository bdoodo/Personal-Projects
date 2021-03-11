import React from 'react'
import { Card, Image, Text, Flex } from '@fluentui/react-northstar'
import { Link } from 'react-router-dom'

const Onboarding = ({hours, addFilters}) => {
  const timeOfDay = hours <= 10 ? 'breakfast'
    : hours <= 16 ? 'lunch' 
    : 'dinner'

    const cardImages = {
      night: {
        stayingIn: 'https://i.pinimg.com/originals/85/2a/6a/852a6a539530feca6b0b6987f9431d14.png',
        goingOut: 'https://image.freepik.com/free-vector/night-city-futuristic-landscape-background_1441-2737.jpg'
      },
      day: {
        stayingIn: 'https://img.freepik.com/free-vector/hi-tech-home-nature-illustration_53876-43779.jpg?size=338&ext=jpg',
        goingOut: 'https://media.istockphoto.com/vectors/futuristic-city-day-vector-id1087611152?k=6&m=1087611152&s=170667a&w=0&h=cs1HrfXMwwds0kfX82J0ntP5a4cfgbbpR0GS709yBTE='
      }
    }
    function getImage(inOut) {
      return timeOfDay === 'dinner' ? cardImages.night[`${inOut}`]
        : cardImages.day[`${inOut}`]
    }

  return (
    <>
      <Flex column gap="gap.large" styles={{marginBottom: '50px'}}>
        <Text align="center" as="h1" size="large">Vegoons</Text>
        <Text as="h2">What's for {timeOfDay}?</Text>
      </Flex>
      <Flex hAlign='center'>
        <Flex column gap="gap.small">
          <Link to='/categories' style={{textDecoration: 'none'}}>
            <Card 
              elevated 
              aria-roledescription="card for going out" 
              onClick={() => {addFilters({goingOut: true})}}
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
              onClick={() => {addFilters({goingOut: false})}}
            >
              <Card.Header>
                <Text size="large">{timeOfDay === 'dinner' ? 'night in?' : 'staying in?'}</Text>
              </Card.Header>
              <Card.Body fitted styles={{maxHeight: '150px', overflow: 'hidden'}}>
                <Image src={getImage('stayingIn')} fluid styles={{position: 'relative', bottom: '50%'}}/>
              </Card.Body>
            </Card>
          </Link>
        </Flex>
      </Flex>
    </>
  )
}

export default Onboarding