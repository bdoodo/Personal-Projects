import {mergeStyleSets, getTheme} from '@fluentui/react'

const theme = getTheme()

const classNames = () => {
  return mergeStyleSets({
    card: {
      boxShadow: theme.effects.elevation4
    },
    
  })
}

export default classNames