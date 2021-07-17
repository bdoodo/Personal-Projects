type Word = {
  id?,
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

interface Association {
  name: string,
  occurrences: number
}