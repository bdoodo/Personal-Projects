import fetch from 'node-fetch'
import http from 'http'
const port = '3000'

const server = http.createServer(async (req, res) => {
  res.end(await routeFor(req))
})

server.listen(port, () => {
  console.log(`listening on port ${port}`)
})

async function routeFor({url, method}) {
  url = new URL(url, `http://localhost:${port}`)
  if (url.pathname === '/current') {
    if (method === 'POST') {
      const params = url.searchParams
      const lat = params.get('lat')
      const lng = params.get('lng')

      const data = await getForecast(lat, lng)

      return JSON.stringify(data)
    }
  }
}

async function getForecast(lat, lng) {
  const response = await fetch(`https://api.weather.gov/points/${lat},${lng}`)
  const data = await response.json()
  const forecastRes = await fetch(`${data.properties.forecast}`)
  const forecastData = await forecastRes.json()
  const period = forecastData.properties.periods[0]

  return {
    current_temperature: period.temperature,
    desc: `${period.name} will be ${period.detailedForecast}`
  }
}