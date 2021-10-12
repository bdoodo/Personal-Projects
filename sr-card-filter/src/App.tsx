import styles from './App.module.css'
import React, { useState, useEffect } from 'react'
import { JobBox } from './components'

function App(props: { jobs: JobInfo[] }) {
  let { jobs } = props

  let jobsTest: JobInfo[] = []

  for (let i = 0; i < 10; i++) {
    jobsTest.push({
      title: `title ${i}`,
      desc: '$60,000 - $80,000 full time base pay, plus available $10,000 Paid Professional Development.',
      location: 'Tampa, Florida',
      remote: Math.random() > 0.5 ? true : false,
      type: Math.random() > 0.5 ? 'Full-Time' : 'Part-Time'
    })
  }

  type Tab = 'All' | 'Full-Time' | 'Part-Time' | 'Remote'

  const [tab, setTab] = useState<Tab>('All')

  const tabs: Tab[] = ['All', 'Full-Time', 'Part-Time', 'Remote']

  const handleTab = (newTab: Tab) => setTab(newTab)

  return (
    <div className={styles['App']}>
      <header className={styles['App-header']}>
        {tabs.map(thisTab => (
          <div
            className={`${styles['tab']} ${
              thisTab === tab && styles['active-tab']
            }`}
            onClick={() => handleTab(thisTab)}
          >
            {thisTab}
          </div>
        ))}
      </header>
      <main className={styles['main']}>
        {jobsTest.map(
          job =>
            //Filtering logic
            ((tab === 'Remote' && job.remote) || tab === job.type || tab === 'All') && (
              <JobBox info={job} />
            )
        )}
      </main>
    </div>
  )
}

export default App
