import React from 'react'
import {render, screen} from '@testing-library/react'
import {within} from '@testing-library/dom'
import {RestaurantCard} from '../ItemCards'

const mockData = {
  "id": "FmGF1B-Rpsjq1f5b56qMwg",
  "alias": "molinari-delicatessen-san-francisco",
  "name": "Molinari Delicatessen",
  "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/B5vUs6hU1W6UcBQL52v2GQ/o.jpg",
  "is_closed": false,
  "url": "https://www.yelp.com/biz/molinari-delicatessen-san-francisco?adjust_creative=ud38N-D7eebKzQlBmRX6NQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=ud38N-D7eebKzQlBmRX6NQ",
  "review_count": 1157,
  "categories": [
      {
          "alias": "delis",
          "title": "Delis"
      }
  ],
  "rating": 4.5,
  "coordinates": {
      "latitude": 37.79838,
      "longitude": -122.40782
  },
  "transactions": [
      "pickup",
      "delivery"
  ],
  "price": "$$",
  "location": {
      "address1": "373 Columbus Ave",
      "address2": "",
      "address3": "",
      "city": "San Francisco",
      "zip_code": "94133",
      "country": "US",
      "state": "CA",
      "display_address": [
          "373 Columbus Ave",
          "San Francisco, CA 94133"
      ]
  },
  "phone": "+14154212337",
  "display_phone": "(415) 421-2337",
  "distance": 1453.998141679007
} //library used to match the mock data rating to the respective src
const icons = {0: 'small_0', 1: 'small_1', 1.5: 'small_1_half', 2: 'small_2', 2.5: 'small_2_half', 3: 'small_3', 3.5: 'small_3_half', 4: 'small_4', 4.5: 'small_4_half', 5: 'small_5'}

expect.extend({
  //used to find a yelp rating image within a card and checks its value against the mock data rating
  toHaveCorrectYelpRating(received, data) {
    const message = `expected rating to match ${data.rating}`
    const displayedImg = within(received).getByRole('img', {name: 'yelp rating'})
    const RegEx = new RegExp(icons[data.rating])
    const matches = displayedImg.getAttribute('src').match(RegEx)

    return {
      message: () => message,
      pass: matches.length >= 1
    }
  }
})

test('card shows yelp rating', () => {
  render(<RestaurantCard info={mockData} delay={0} />)
  expect(screen.getByRole('group')).toHaveCorrectYelpRating(mockData)
})