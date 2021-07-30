export const parseDate = (dateString: string) => {
  const date = new Date(dateString)

  const dateFormat = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    hour12: true,
  })

  return dateFormat.format(date)
}
