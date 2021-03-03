import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import {useState, useEffect} from "react"
import Onboarding from "./Onboarding"
import { 
  ThemeProvider, createTheme, loadTheme,
  Link
} from '@fluentui/react'
import Layout from '../components/layout'

//fluent UI theme palette
const darkTheme = createTheme({
  palette: {
    themePrimary: '#9d6ff2',
    themeLighterAlt: '#06040a',
    themeLighter: '#191227',
    themeLight: '#2f2149',
    themeTertiary: '#5e4391',
    themeSecondary: '#8a62d5',
    themeDarkAlt: '#a77df4',
    themeDark: '#b491f5',
    themeDarker: '#c7adf8',
    neutralLighterAlt: '#2b2928',
    neutralLighter: '#333231',
    neutralLight: '#41403e',
    neutralQuaternaryAlt: '#4a4846',
    neutralQuaternary: '#514f4d',
    neutralTertiaryAlt: '#6f6c6a',
    neutralTertiary: '#f1f1f1',
    neutralSecondary: '#f4f4f4',
    neutralPrimaryAlt: '#f6f6f6',
    neutralPrimary: '#ebebeb',
    neutralDark: '#fafafa',
    black: '#fdfdfd',
    white: '#201f1e',
  }})
const lightTheme = createTheme({
  palette: {
    themePrimary: '#00798f',
    themeLighterAlt: '#f0f9fb',
    themeLighter: '#c7e7ed',
    themeLight: '#9bd3dd',
    themeTertiary: '#4babbc',
    themeSecondary: '#13889c',
    themeDarkAlt: '#006d81',
    themeDark: '#005c6d',
    themeDarker: '#004450',
    neutralLighterAlt: '#f8f8f8',
    neutralLighter: '#f4f4f4',
    neutralLight: '#eaeaea',
    neutralQuaternaryAlt: '#dadada',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c8c8',
    neutralTertiary: '#595959',
    neutralSecondary: '#373737',
    neutralPrimaryAlt: '#2f2f2f',
    neutralPrimary: '#000000',
    neutralDark: '#151515',
    black: '#0b0b0b',
    white: '#ffffff',
  }});

//choose which theme to load based on user preferences
let darkThemePreference = window.matchMedia('(prefers-color-scheme: dark)')
darkThemePreference.addListener(() => {
  loadTheme(darkThemePreference.matches ? darkTheme : lightTheme)
})

function App() {
  const {latitude, longitude} = useLocation()
  const {hours} = useTime()

  return (
    <ThemeProvider>
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
    </ThemeProvider>
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