interface PageInfo {
  title: String
  slug: String
  blocks: {
    type: String
    headline: String
    subhead: String
    cta: String
    background: String
  }[]
}