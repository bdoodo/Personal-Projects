import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core'
import { DeleteOutlined } from '@material-ui/icons'

export const WordListItem = ({
  filters: { filters, setFilters },
  word,
  removeWord,
  filterByWord,
  disabled = false,
  mobile,
}: {
  filters: {
    filters: {
      words: string[]
      labels: string[]
    }
    setFilters: React.Dispatch<
      React.SetStateAction<{
        words: string[]
        labels: string[]
      }>
    >
  }
  word: Word
  removeWord: (word: string) => Promise<void>
  filterByWord: (word: string) => void
  disabled?: boolean
  mobile?: boolean
}) => {
  /**On click, update word filters and toggle selected */
  const handleItemClick = (word: string) => {
    filterByWord(word)
    setFilters({
      ...filters,
      words: filters.words.includes(word)
        ? filters.words.filter(selectedWord => selectedWord !== word)
        : [...filters.words, word],
    })
  }

  const desktopProps = !mobile &&
     {
        button: true as true,
        onClick: () => handleItemClick(word.name),
      }

  return (
    <ListItem
      key={word.id}
      role="list"
      {...desktopProps}
      selected={filters.words.includes(word.name)}
      disabled={disabled}
    >
      <ListItemText>{word.name}</ListItemText>
      <ListItemSecondaryAction>
        <IconButton>
          <DeleteOutlined onClick={() => removeWord(word.name)} />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}
