import React, { useEffect, useState, useLayoutEffect } from 'react'
import { useParams } from 'react-router'

export const Page_UI = () => {
  const [pageInfo, setPageInfo] = useState<PageInfo | null>()

  const { slug } = useParams() as { slug: String }

  useEffect(() => {
    ;(async () => {
      const pagesData = await fetch(
        'https://f.v1.n0.cdn.getcloudapp.com/items/3e1W2F0W1s2U2d3R2Z46/content.json'
      )
      const pages = (await pagesData.json()).pages as PageInfo[]

      const pageData = pages.find(page => page.slug === slug) || null

      setPageInfo(pageData)
    })()
  }, [slug])

  const block = pageInfo?.blocks[0]

  return (
    <>
      <img src={`/backgrounds/${block?.background}`} />
      <main>
        {!pageInfo ? (
          'loading'
        ) : (
          <>
            <div className="headline">{block?.headline}</div>
            <div className="sub-head">{block?.subhead}</div>
            <div className="cta">{block?.cta}</div>
          </>
        )}
      </main>
    </>
  )
}
