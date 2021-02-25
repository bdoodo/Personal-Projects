/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import LocationTimeContext from "../contexts/timeAndLocationContext"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }, coordinates) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <LocationTimeContext.Consumer>
      {LocationTime => (
        <>
          <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
          <div
            style={{
              margin: `0 auto`,
              maxWidth: 960,
              padding: `0 1.0875rem 1.45rem`,
            }}
          >
            <h1>{LocationTime.latitude}{LocationTime.time} </h1>
            <main>{children}</main>
            <footer
              style={{
                marginTop: `2rem`,
              }}
            >
              © {new Date().getFullYear()}, Built with
              {` `}
              <a href="https://www.gatsbyjs.com">Gatsby</a>
            </footer>
          </div>
        </>
      )}
    </LocationTimeContext.Consumer>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
