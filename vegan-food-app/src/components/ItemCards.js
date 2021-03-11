import React, {useEffect} from 'react'
import {Card, Image, Flex, Text} from '@fluentui/react-northstar'

//import rating icons
import small_0 from '../assets/yelp-rating-icons/small_0.png'
import small_1 from '../assets/yelp-rating-icons/small_1.png'
import small_1_half from '../assets/yelp-rating-icons/small_1_half.png'
import small_2 from '../assets/yelp-rating-icons/small_2.png'
import small_2_half from '../assets/yelp-rating-icons/small_2_half.png'
import small_3 from '../assets/yelp-rating-icons/small_3.png'
import small_3_half from '../assets/yelp-rating-icons/small_3_half.png'
import small_4 from '../assets/yelp-rating-icons/small_4.png'
import small_4_half from '../assets/yelp-rating-icons/small_4_half.png'
import small_5 from '../assets/yelp-rating-icons/small_5.png'
const icons = {0: small_0, 1: small_1, 1.5: small_1_half, 2: small_2, 2.5: small_2_half, 3: small_3, 3.5: small_3_half, 4: small_4, 4.5: small_4_half, 5: small_5}



const RestaurantCard = ({info, goingOut}) => {
  const ratingRound = (rating) => {
    return Math.round(rating*2)/2
    //return Number.isInteger(rounded) ? `${rounded}` : `${Math.trunc(rounded)}_half`
  }

  return (
    <a href={info.url} target='_blank'>
      <Card elevated>
        <Card.Header>
          <Text size='large' weight='light'>{info.name}</Text>
          <Text size='smaller' styles={{color:'grey'}}>{info.location?.address1}, {info.location?.city}</Text>
        </Card.Header>
        <Card.Body>
          <Flex gap="gap.medium">
            <Flex.Item styles={{maxWidth: '33%'}}>
              <Image fluid src={info.image_url} styles={{borderRadius: '3px', height:'100%'}}/>
            </Flex.Item>
            <Flex.Item grow>
              <Flex column gap='gap.smaller'>
                <Image src={icons[ratingRound(info.rating)]} styles={{maxWidth: '80px'}}/>
                <Text size='small'>
                  {info.price ? `${info.price} • ` : null}{info.categories?.map(x => x.title + ' ')}
                </Text>
                <Text>{info.transactions?.join('/')}</Text>
              </Flex>
            </Flex.Item>
          </Flex>
        </Card.Body>
        <Card.Footer>
          <Flex space='between' styles={{padding: '0 10px 0'}}>
            {info.distance ? 
              <Flex.Item>
                <Text>{(info.distance/1609).toFixed(1)} mi</Text>
              </Flex.Item>
              : null
            }
            <Flex.Item push styles={{maxWidth: '20px'}}>
              <Image fluid src={'https://s3-media4.fl.yelpcdn.com/assets/srv0/styleguide/c910e279d123/assets/img/brand_guidelines/burst_icon@2x.png'}/>
            </Flex.Item>
          </Flex>
        </Card.Footer>
      </Card>
    </a>
  )
}

const RecipeCard = ({info}) => {
  return (
    <a href={info.recipe?.url} target='_blank'>
      <Card elevated>
        <Card.Header>
          <Text size='large' weight='light'>{info.recipe?.label}</Text>
        </Card.Header>
        <Card.Body>
          <Flex gap="gap.medium">
          <Flex.Item styles={{maxWidth: '33%'}}>
              <Image fluid src={info.recipe?.image} styles={{borderRadius: '3px'}}/>
            </Flex.Item>
            <Flex.Item grow>
              <Flex column vAlign='center'>
                <Flex.Item grow>
                </Flex.Item>
                <Text>{info.recipe?.mealType}</Text>
                <Text>{info.recipe?.dishType.join(', ')}</Text>
                <Text>{info.recipe?.totalTime} mins</Text>
              </Flex>
            </Flex.Item>
          </Flex>
        </Card.Body>
        <Card.Footer>
          <Flex hAlign='end'>
            <Text atMention='me'>{info.recipe?.source}</Text>
          </Flex>
        </Card.Footer>
      </Card>
    </a>
  )
}

export {RestaurantCard, RecipeCard}