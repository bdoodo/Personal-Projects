import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import styles from './Page_UI.module.css'
import { LazyImage } from '.'

export const Page_UI = (props: {
  setCurrentLink: React.Dispatch<React.SetStateAction<string>>
}) => {
  const [pageInfo, setPageInfo] = useState<PageInfo | null | undefined>()

  //The current URL route
  const { slug } = useParams() as { slug: String }

  //Fetch new page info on first render and whenever the URL changes
  useEffect(() => {
    ;(async () => {
      setPageInfo(undefined)

      const pagesData = await fetch(
        'https://f.v1.n0.cdn.getcloudapp.com/items/3e1W2F0W1s2U2d3R2Z46/content.json'
      )
      const pages = (await pagesData.json()).pages as PageInfo[]

      //Find the corresponding page info or set page info
      //to null if nothing came up (indicating a bad URL)
      const page = pages.find(p => p.slug === slug) || null

      setPageInfo(page)

      //Used to color the active menu link
      props.setCurrentLink(`/${slug}`)
    })()
  }, [slug])

  const block = pageInfo?.blocks[0]

  return (
    <main className={styles.root}>
      {/*I decided not to include any 'loading' text 
      or icon since the site as is matches your 
      elegant minimalist design concept more */}

      {pageInfo === null ? (
        <h1 className={styles['not-found']}>404 😭</h1>
      ) : (
        <>
          <LazyImage
            src={`/backgrounds/${block?.background}`}
            width={window.innerWidth}
            height={window.innerHeight}
            classes={`${styles.background}`}
          />
          <div className={styles.headers}>
            <div className={styles['headers_headline']}>{block?.headline}</div>
            <div className={styles['headers_sub-head']}>{block?.subhead}</div>
          </div>
          <div className={styles['cta-block']}>
            <div className={styles['cta-block_cta']}>{block?.cta}</div>
            <a href="" className={styles['cta-block_lets-talk']}>
              <span>LET'S TALK.</span>
              <div className={styles.arrow}>
                <div className={styles['arrow_arrow-stem']}></div>
                <div className={styles['arrow_arrow-point']}></div>
              </div>
            </a>
          </div>
        </>
      )}
    </main>
  )
}
