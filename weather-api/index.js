import fetch from 'node-fetch'
import express from 'express'

const app = express()
const port = '3000'

app.post('/current', async (req, res) => {
  const {lat, lng} = req.query
  const data = await getForecast(lat, lng)
  res.send(JSON.stringify(data))
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

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