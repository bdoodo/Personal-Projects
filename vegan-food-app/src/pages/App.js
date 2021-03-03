import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import {useState, useEffect} from "react"
import Onboarding from "./Onboarding"
import { 
  Link, Card, Flex, Image, Text, Provider, teamsTheme, teamsDarkV2Theme
} from '@fluentui/react-northstar'


function App() {
  const {latitude, longitude} = useLocation()
  const {hours} = useTime()

  //change theme according to user theme color preference
  let darkThemePreference = window.matchMedia('(prefers-color-scheme: dark)')
  const [theme, setTheme] = useState(teamsTheme)
  darkThemePreference.addEventListener('change', () => {
    setTheme(darkThemePreference.matches ? teamsDarkV2Theme : teamsTheme)
  })

  return (
    <Provider theme={theme}>
    <Router>
      <Switch>
        <Route path="/secondPage">
          <h1>hi</h1>
        </Route>
        <Route path="/thirdPage">
          <h1>ho</h1>
        </Route>
        <Route path="/">
          <Onboarding hours={hours}/>
        </Route>
      </Switch>
    </Router>
    </Provider>
  );
}

//custom hooks

const useLocation = () => {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0
  })
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(findLocation)
    }

    function findLocation(pos) {
      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      })
    }
  }, []) 

  return location
}

const useTime = () => {
  const [time, setTime] = useState({hours: 0, minutes: 0})
  useEffect(() => {
    const date = new Date()
    setTime({
      hours: date.getHours(),
      minutes: date.getMinutes()
    })
  }, [])

  return time
}

export default App;