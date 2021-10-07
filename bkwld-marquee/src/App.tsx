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
  //All component logic here is used to render menu links,
  //which includes manipulating their colors

  const [currentLink, setCurrentLink] = useState('/industries ')

  const activeColor = (slug: String) =>
    currentLink === slug ? styles['active-link'] : undefined

  const pages = ['Industries', 'Services', 'About Us']

  const slug = (pageName: string) => pageName.toLowerCase().replace(' ', '-')

  return (
    <div className={styles.App}>
      <Router>
        <header className={styles['App-header']}>
          <div>
            <a href="/">
              <img src={Logo} />
            </a>
            <div className={`${styles.menu} ${styles['text-style-3']}`}>
              {pages.map(page => (
                <Link
                  className={activeColor(`/${slug(page)}`)}
                  to={`/${slug(page)}`}
                >
                  {page}
                </Link>
              ))}
            </div>
          </div>
          <a href="" className={styles.rectangle}>
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
