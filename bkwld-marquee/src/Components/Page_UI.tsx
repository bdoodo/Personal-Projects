import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import styles from './Page_UI.module.css'

export const Page_UI = (props: {
  setCurrentLink: React.Dispatch<React.SetStateAction<string>>
}) => {
  const [pageInfo, setPageInfo] = useState<PageInfo | null | undefined>()

  const { slug } = useParams() as { slug: String }

  //Fetch new page info on first render and whenever the URL changes
  useEffect(() => {
    ;(async () => {
      setPageInfo(undefined)
      const pagesData = await fetch(
        'https://f.v1.n0.cdn.getcloudapp.com/items/3e1W2F0W1s2U2d3R2Z46/content.json'
      )
      const pages = (await pagesData.json()).pages as PageInfo[]

      const page = pages.find(p => p.slug === slug) || null

      setPageInfo(page)

      props.setCurrentLink(`/${slug}`)
    })()
  }, [slug])

  const block = pageInfo?.blocks[0]

  return (
    <main className={styles.root}>
      {pageInfo === undefined ? (
        'Loading ...'
      ) : pageInfo === null ? (
        'Bad url 🙁'
      ) : (
        <>
          <img
            src={`/backgrounds/${block?.background}`}
            className={styles.background}
          />
          <div className={styles.headers}>
            <div className={styles.headline}>{block?.headline}</div>
            <div className={styles['sub-head']}>{block?.subhead}</div>
          </div>
          <div className={styles['cta-block']}>
            <div className={styles.cta}>{block?.cta}</div>
            <a href='' className={styles['questions-lets-talk']}>
              <span>LET'S TALK.</span>
              <div className={styles.arrow}>
                <div className={styles['arrow-stem']}></div>
                <div className={styles['arrow-point']}></div>
              </div>
            </a>
          </div>
        </>
      )}
    </main>
  )
}
