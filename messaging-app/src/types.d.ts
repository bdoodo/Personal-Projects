interface IndexedMessage {
  id: number,
  title: string,
  body: string,
  read: boolean,
  sent: string,
  sender: string,
  receiver: string
}

interface ComposedMessage {
  title: string,
  body: string,
  receiver: string
}