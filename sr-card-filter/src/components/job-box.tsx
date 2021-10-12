import React from 'react'
import locationIcon from '../assets/place_black_24dp.svg'
import styles from './job-box.module.css'

export const JobBox = (props: { info: JobInfo }) => {
  const {
    info: { title, desc, location }
  } = props

  return (
    <div className={styles['job-box']}>
      <div className={styles['get-hired']}><a href='/#' className={styles['rectangle']}>Get Hired</a></div>
      <div className={styles['text']}>
        <div className={styles['title']}>{title}</div>
        <div className={styles['desc']}>{desc}</div>
      </div>
      <div className={styles['location']}>
        <span className={`material-icons ${styles['location-icon']}`}>place</span>
        <span>{location}</span>
      </div>
    </div>
  )
}
