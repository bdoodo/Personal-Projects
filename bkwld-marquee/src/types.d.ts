interface PageInfo {
  title: string
  slug: string
  blocks: {
    type: string
    headline: string
    subhead: string
    cta: string
    background: string
  }[]
}