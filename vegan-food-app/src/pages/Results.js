import React from 'react'
import { Button, UndoIcon } from '@fluentui/react-northstar'

const Results = ({filters, addFilters}) => {
  console.log(filters)
  return(
    <Button 
      circular 
      icon={<UndoIcon/>} 
      styles={{position: 'absolute', top: '20px', left: '20px'}}
      onClick={() => {window.history.back()}}
    />
  )
}

export default Results