import './App.css'
import Logo from './Assets/abc_logo.svg'
import { Page_UI } from './Components'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

const App = () => {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <img src={Logo} />
          <div className="menu text-style-3">
            <Link to='/industries'>Industries</Link>
            <Link to='/services'>Services</Link>
            <Link to='/about-us'>About Us</Link>
          </div>
          <div className="rectangle">
            <span className="text">Contact Us</span>
          </div>
        </header>
        <Route path="/:slug" children={<Page_UI />} />
      </Router>
    </div>
  )
}

export default App
