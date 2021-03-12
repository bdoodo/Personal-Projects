import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom"
import {useState, useEffect} from "react"
import Onboarding from "./pages/Onboarding"
import Categories from './pages/Categories'
import Results from './pages/Results'
import { 
  Provider, 
  teamsV2Theme, teamsDarkV2Theme,
  Segment
} from '@fluentui/react-northstar'



function App() {
  const {latitude, longitude} = useLocation()
  const {hours} = useTime()

  const [filters, setFilters] = useState({})
  const timeOfDay = hours <= 10 ? 'breakfast'
    : hours <= 16 ? 'lunch' 
    : 'dinner'
  useEffect(() => {
    setFilters({...filters, course: timeOfDay})
  }, [timeOfDay])

  //change theme according to user theme color preference  
  let darkThemePreference = window.matchMedia('(prefers-color-scheme: dark)')

  const [theme, setTheme] = useState(teamsV2Theme)
  useEffect(() => {
    setTheme(darkThemePreference.matches ? 
      teamsDarkV2Theme 
      : teamsV2Theme
    )
  }, [darkThemePreference])

  darkThemePreference.addEventListener('change', () => {
    setTheme(darkThemePreference.matches ? 
      teamsDarkV2Theme 
      : teamsV2Theme
    )
  })

  return (
    <Provider theme={{
      ...theme, 
      siteVariables: {
        ...theme.siteVariables,
        bodyFontFamily: '"sutro", "karmina-sans"'
      }
    }}>
      <Segment styles={{minHeight: '100%', width: '100%', position: 'absolute'}}>
      <Router>
        <Switch>
          <Route path="/categories">
            <Categories hours={hours} filters={filters} setFilters={setFilters}/>
          </Route>
          <Route path="/results">
            <Results filters={filters} setFilters={setFilters} location={{latitude: latitude, longitude: longitude}}/>
          </Route>
          <Route path="/">
            <Onboarding hours={hours} filters={filters} setFilters={setFilters}/>
          </Route>
        </Switch>
      </Router>
      </Segment>
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