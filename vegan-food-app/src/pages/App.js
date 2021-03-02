import {
  BrowserRouter as Router,
  Route,
  Link
} from "react-router-dom";
import {useState, useEffect} from "react"
import moment from "moment"

function App() {
  const {latitude, longitude} = useLocation()
  const time = useTime()

  return (
    <Router>
      <Link to="/secondPage">Second Page</Link>
      <Route path="/secondPage">
        <h1>hello hello {time}</h1>
      </Route>
    </Router>
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
  const [time, setTime] = useState(0)
  useEffect(() => {
    setTime(moment().format('LT'))
  })

  return time
}

export default App;