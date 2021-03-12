const fetch = require('node-fetch')
const {Headers} = fetch

const handler = async event => {
  //required: filters, show, from
  const filters = JSON.parse(event.queryStringParameters.filters)
  const {show, from} = event.queryStringParameters
  const {YELP_API_KEY, EDAMAM_APP_ID, EDAMAM_APP_KEY} = process.env


  let url
  let headers

  try {
    //restaurants
    if (show === 'restaurants') {
      const {latitude, longitude} = JSON.parse(event.queryStringParameters.location)
      const {search = '', cuisine = ''} = filters

      url = new URL(`https://api.yelp.com/v3/businesses/search`)
      let searchParams = new URLSearchParams([['term', `${search} ${cuisine} vegan`], ['latitude', latitude], ['longitude', longitude], ['open_now', true], ['radius', 16093], ['offset', from], ['limit', 20]])
      url.search = searchParams.toString()
      console.log(url.href)
      headers = [['Authorization', `Bearer ${YELP_API_KEY}`]]
    } // recipes
    else {
      const {search = '', course = ''} = filters
      
      url = new URL(`https://api.edamam.com/search`)
      let searchParams = new URLSearchParams([['health', 'vegan'], ['mealType', course], ['q', search], ['from', from], ['to', parseInt(from) + 19], ['app_id', EDAMAM_APP_ID], ['app_key', EDAMAM_APP_KEY]])
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
