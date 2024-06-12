import { useEffect } from 'react'
import { useNavTo } from '../../helpers/navTo'

export function NewChatPage() {
  const navTo = useNavTo()

  useEffect(() => {
    fetch('/api/start-chat', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        navTo('Chat', data.chatId)
      })
  }, [navTo])

  return (
    <div>
      <h1>Starting New Chat</h1>
    </div>
  )
}
