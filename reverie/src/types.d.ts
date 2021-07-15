type Word = {
  id?,
  name: string
}

type WordImages = {
  word: Word,
  images:
    {
      url?: string,
      bytes?: Uint8Array,
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