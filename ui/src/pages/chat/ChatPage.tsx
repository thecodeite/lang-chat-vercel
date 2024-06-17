import { useParams } from 'react-router-dom'
import { ChatBox } from './ChatBox'

export function ChatPage() {
  const { id } = useParams()

  if (!id) {
    return <div>Chat not found</div>
  }

  return (
    <>
      <ChatBox chatId={id} />
    </>
  )
}
