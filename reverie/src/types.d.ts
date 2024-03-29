type WordList = {
  id: string,
  name: string,
  words?: {
    active?: Word[],
    inactive?: Word[]
  },
  associations?: Association[],
  wordImages?: WordImages[],
  filters?: {
    words: string[],
    labels: string[]
  }
}

type Word = {
  id: string,
  name: string,
  wordListID: string
  createdAt?: any
}

type WordImages = {
  word: Word,
  images:
    {
      title: string,
      url: string,
      bytes?: Uint8Array,
      bytesUrl?: string,
      labels?: string[]
    }[],
  allLabels?: string[]
}

interface Association {
  name: string,
  occurrences: number
}

interface User {
  email: string | undefined
  password: string | undefined
  isSignedIn: boolean
}