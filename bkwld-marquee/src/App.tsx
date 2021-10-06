import styles from './App.module.css'
import Logo from './Assets/abc_logo.svg'
import { Page_UI } from './Components'
import {
  BrowserRouter as Router,
  Link,
  Route,
  Redirect,
} from 'react-router-dom'
import { useState } from 'react'

const App = () => {
  const [currentLink, setCurrentLink] = useState('/industries ')

  const activeColor = (slug: String) =>
    currentLink === slug ? styles['active-link'] : undefined

  return (
    <div className={styles.App}>
      <Router>
        <header className={styles['App-header']}>
          <div>
            <a href='/'><img src={Logo} /></a>
            <div className={`${styles.menu} ${styles['text-style-3']}`}>
              <Link className={activeColor('/industries')} to="/industries">
                Industries
              </Link>
              <Link className={activeColor('/services')} to="/services">
                Services
              </Link>
              <Link className={activeColor('/about-us')} to="/about-us">
                About Us
              </Link>
            </div>
          </div>
          <a href='' className={styles.rectangle}>
            <span className={styles.contact}>Contact Us</span>
          </a>
        </header>
        {/*There is no home page, so redirect to industries*/}
        <Route exact path="/" children={<Redirect to="/industries" />} />
        <Route path="/:slug" children={<Page_UI {...{ setCurrentLink }} />} />
      </Router>
    </div>
  )
}

export default App
