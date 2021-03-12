const fetch = require('node-fetch')
const {Headers} = fetch

const handler = async event => {
  const filters = JSON.parse(event.queryStringParameters.filters)
  const {show} = event.queryStringParameters
  const {YELP_API_KEY, EDAMAM_APP_ID, EDAMAM_APP_KEY} = process.env


  let url
  let headers

  try {
    //restaurants
    if (show === 'restaurants') {
      const location = JSON.parse(event.queryStringParameters.location)

      url = new URL(`https://api.yelp.com/v3/businesses/search`)
      let searchParams = new URLSearchParams([['term', `${filters.search ? filters.search : ''} ${filters.cuisine ? filters.cuisine : ''} vegan`], ['latitude', location.latitude], ['longitude', location.longitude], ['open_now', true], ['radius', 16093]])
      url.search = searchParams.toString()
      console.log(url.href)
      headers = [['Authorization', `Bearer ${YELP_API_KEY}`]]
    } // recipes
    else {
      const {search = ''} = filters
      
      url = new URL(`https://api.edamam.com/search`)
      let searchParams = new URLSearchParams([['health', 'vegan'], ['mealType', filters.course], ['q', search], ['app_id', EDAMAM_APP_ID], ['app_key', EDAMAM_APP_KEY]])
      if (filters.cuisine) searchParams.append('cuisineType', filters.cuisine)
      url.search = searchParams.toString()
      console.log(url.href)
    }

    const response = await fetch(url.href, {
      headers: new Headers(headers)
    })
    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText }
    }    
    const data = await response.json()

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    // output to netlify function log
    console.log(error)
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    }
  }
}

module.exports = { handler }
