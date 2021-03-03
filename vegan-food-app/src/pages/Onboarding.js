import React from 'react'
import { Card, Image, Text, Flex } from '@fluentui/react-northstar'

const Onboarding = ({hours}) => {
  const timeOfDay = hours <= 11 ? 'breakfast'
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
      if (timeOfDay === 'dinner') return cardImages.night[`${inOut}`]
      return cardImages.day[`${inOut}`]
    }

  return (
    <>
      <Text align="center" as="h1" size="large">Vegoons</Text>
      <h2>What's for {timeOfDay}?</h2>
      <Flex hAlign='center'>
        <Flex column gap="gap.small">
          <Card elevated aria-roledescription="card with image and text" styles={{height: 'auto'}}>
            <Card.Header>
              <Text size="large" variables=''>{timeOfDay === 'dinner' ? 'Night out,' : 'Going out,'}</Text>
            </Card.Header>
            <Card.Body fitted>
                <Image src={getImage('goingOut')} fluid/>
            </Card.Body>
          </Card>
          <Flex hAlign='center'>
            <Text size="large">or</Text>
          </Flex>
          <Card elevated aria-roledescription="card with image and text" styles={{height: 'auto'}}>
            <Card.Header>
              <Text size="large">{timeOfDay === 'dinner' ? 'night in?' : 'staying in?'}</Text>
            </Card.Header>
            <Card.Body fitted styles={{maxHeight: '175px', overflow: 'hidden'}}>
              <Image src={getImage('stayingIn')} fluid/>
            </Card.Body>
          </Card>
        </Flex>
      </Flex>
    </>
  )
}

export default Onboarding