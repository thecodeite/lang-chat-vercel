import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChatHistory } from './useChat'
import { ChatBox } from './ChatBox'

interface ChatRecord {
  id: string
  owner: string
  created: string
  summary: string
  chat: ChatHistory[]
}

export function ChatPage() {
  const [chat, setChat] = useState<ChatRecord | null>(null)
  const { id } = useParams()
  useEffect(() => {
    fetch(`/api/chat?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setChat(data)
      })
  }, [id])

  if (!chat) {
    return <div>Loading...</div>
  }

  if (!id || !chat.chat) {
    return <div>Chat not found</div>
  }

  return (
    <>
      {/* <pre>{JSON.stringify(chat, null, 2)}</pre> */}
      <ChatBox chatId={id} init={chat.chat} />
    </>
  )
}
