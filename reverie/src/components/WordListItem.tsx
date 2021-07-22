import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core'
import { DeleteOutlined } from '@material-ui/icons'

export const WordListItem = ({
  selected: { selected, setSelected },
  word,
  removeWord,
  filterByWord,
  disabled = false,
}: {
  selected: {
    selected: string[]
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  }
  word: Word
  removeWord: (word: string) => Promise<void>
  filterByWord: (word: string) => void
  disabled?: boolean
}) => {
  /**On click, update word filters and toggle selected */
  const handleItemClick = (word: string) => {
    filterByWord(word)
    setSelected(
      selected.includes(word)
        ? selected.filter(selectedWord => selectedWord !== word)
        : [...selected, word]
    )
  }

  return (
    <ListItem
      key={word.id}
      role="list"
      button
      onClick={() => handleItemClick(word.name)}
      selected={selected.includes(word.name)}
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
