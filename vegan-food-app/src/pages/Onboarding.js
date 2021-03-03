import React from 'react'
import { Card, Image, Text, Flex } from '@fluentui/react-northstar'

const Onboarding = ({hours}) => {
  return (
    <>
      <Text>Vegoons</Text>
      <h2>What's for {hours <= 11 ? 'breakfast'
        : hours <= 16 ? 'lunch' 
        : 'dinner'}?</h2>
      <Card elevated aria-roledescription="card with image and text">
        <Card.Body fitted>
          <Flex column gap="gap.small">
            <Image src="https://fabricweb.azureedge.net/fabric-website/assets/images/wireframe/square-image.png" />
            <Text content="Citizens of distant epochs muse about at the edge of forever hearts of the..." />
          </Flex>
        </Card.Body>
      </Card>
    </>
  )
}

export default Onboarding