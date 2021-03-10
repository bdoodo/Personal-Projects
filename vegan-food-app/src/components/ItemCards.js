import React from 'react'
import {Card, Image, Flex, Text} from '@fluentui/react-northstar'

const RestaurantCard = ({info}) => {
  return (
    <a href={info.url}>
      <Card elevated>
        <Card.Header>
          {info.name}
        </Card.Header>
        <Card.Body>
          <Flex gap="gap.medium">
            <Flex.Item size='size.smaller'>
              <Image fluid src={info.image_url}/>
            </Flex.Item>
            <Flex.Item grow>
              <Flex column gap='gap.small'>
                <Text>{info.price}</Text>
                <Text>{info.rating}</Text>
                <Text>{info.transactions}</Text>
                <Text>{info.distance}</Text>
              </Flex>
            </Flex.Item>
          </Flex>
        </Card.Body>
      </Card>
    </a>
  )
}

const RecipeCard = ({info}) => {
  return (
    <a href={info.recipe?.url}>
      <Card elevated>
        <Card.Header>
          {info.recipe?.label}
        </Card.Header>
        <Card.Body>
          <Flex gap="gap.medium">
            <Flex.Item size='size.medium'>
              <Image fluid src={info.recipe?.image}/>
            </Flex.Item>
            <Flex.Item grow>
              <Flex column gap='gap.small'>
                {info.recipe?.source}
                {info.recipe?.mealType}
                {info.recipe?.dishType}
                {info.recipe?.totalTime/60}
              </Flex>
            </Flex.Item>
          </Flex>
        </Card.Body>
      </Card>
    </a>
  )
}

export {RestaurantCard, RecipeCard}