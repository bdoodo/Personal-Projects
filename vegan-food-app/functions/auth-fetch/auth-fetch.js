const fetch = require('node-fetch')

const handler = async function (event, context) {
  const {filters, goingOut} = event.queryStringParameters.filters
  const latitude = event.queryStringParameters.latitude
  const longitude = event.queryStringParameters.longitude
  const {YELP_API_KEY, EDAMAM_APP_ID, EDAMAM_APP_KEY} = process.env

  try {
    const response = await fetch(`https://api.yelp.com/v3/businesses/search?term=${filters}&latitude=${latitude}&longitude=${longitude}`, {
      headers: {'Authorization': `Bearer ${YELP_API_KEY}`}
    })
    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText }
    }
    let response2
    if (goingOut) {
      reponse2 = await fetch()
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
