const process = require('process')

const axios = require('axios')
const qs = require('qs')

const handler = async function (event) {
  // apply our function to the queryStringParameters and assign it to a variable
  const API_PARAMS = qs.stringify(event.queryStringParameters)
  console.log('API_PARAMS', API_PARAMS)
  // Get env var values defined in our Netlify site UI

  // TODO: customize your URL and API keys set in the Netlify Dashboard
  // this is secret too, your frontend won't see this
  const { API_SECRET = 'shiba' } = process.env
  const URL = `https://api.yelp.com/v3/autocomplete?text=del&latitude=37.786882&longitude=-122.399972`

  console.log('Constructed URL is ...', URL)

  try {
    const { data } = await axios({
      url: URL,
      headers: {'Authorization': 'Bearer xLvupOZT5InQRXOYQrHJHCWitOI9jXs8sj88VxSd9jITYviVpSygafXVpzCWQ3Q-t_OsI8KoJQB6pV9EkwhYA1gYQ-6HeSZDSpvreJGp8eGg3G2fObmFG6weOwAzYHYx'}
    })
    // refer to axios docs for other methods if you need them
    // for example if you want to POST data:
    //    axios.post('/user', { firstName: 'Fred' })
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    const { status, statusText, headers, data } = error.response
    return {
      statusCode: error.response.status,
      body: JSON.stringify({ status, statusText, headers, data }),
    }
  }
}

module.exports = { handler }
