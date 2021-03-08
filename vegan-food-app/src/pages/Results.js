import React from 'react'
import { Button, UndoIcon } from '@fluentui/react-northstar'
const yelp = require('yelp-fusion');
const client = yelp.client('xLvupOZT5InQRXOYQrHJHCWitOI9jXs8sj88VxSd9jITYviVpSygafXVpzCWQ3Q-t_OsI8KoJQB6pV9EkwhYA1gYQ-6HeSZDSpvreJGp8eGg3G2fObmFG6weOwAzYHYx')



const Results = ({filters, addFilters}) => {
  fetch("/.netlify/functions/token-hider")
  .then(response => response.json())
  .then(console.log)
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