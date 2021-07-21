type WordList = {
  id?: string,
  name: string,
  words?: Word[],
}

type Word = {
  id?: string,
  name: string
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

interface FiltersState {
  filters: {
      words: string[];
      labels: string[];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
      words: string[];
      labels: string[];
  }>>;
}