import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import {useState, useEffect} from "react"
import Categories from './pages/Categories'
import Results from './pages/Results'
import {Provider, teamsV2Theme, teamsDarkV2Theme} from '@fluentui/react-northstar'

//animations
const slideUp = {
  keyframe: {
    from: {
      transform: 'translateY(5px)',
      opacity: 0
    },
    to: {
      transform: 'translateY(0)',
      opacity: 1
    },
  },
  duration: '0.2s',
  fillMode: 'forwards',
  timingFunction: 'ease-out'
}
const fadeIn = {
  keyframe: {
    from: {
      opacity: 0
    },
    to: {
      opacity: 1
    },
  },
  duration: '0.3s',
}
const slideRight = {
  keyframe: {
    from: {
      transform: 'translateX(-5px)',
      opacity: 0
    },
    to: {
      transform: 'translateX(0)',
      opacity: 1
    },
  },
  duration: '0.5s',
  fillMode: 'forwards',
  timingfunction: 'ease-out'
}

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
      },
      animations: {
        slideUp,
        fadeIn,
        slideRight
      }
    }}>
      <Router>
        <Switch>
          <Route path="/results">
            <Results filters={filters} setFilters={setFilters} location={{latitude: latitude, longitude: longitude}}/>
          </Route>
          <Route path="/">
            <Categories filters={filters} setFilters={setFilters} theme={theme}/>
          </Route>
        </Switch>
      </Router>
    </Provider>
  )
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