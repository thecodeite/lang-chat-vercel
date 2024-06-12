import { useRef, useState } from 'react'

export interface ChatHistory {
  role: 'assistant' | 'user'
  content: string
}

// function pause(seconds: number) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, seconds * 1000)
//   })
// }

export function useChat(chatId: string, init: ChatHistory[]) {
  const messageRef = useRef<ChatHistory[]>(init)
  const [messages, setMessages] = useState<ChatHistory[]>(init)

  const addMessage = (role: 'assistant' | 'user', content: string) => {
    messageRef.current = [...messageRef.current, { role, content }]
    setMessages(messageRef.current)
  }

  const sendMessage = async (userMessage: string) => {
    addMessage('user', userMessage)

    const res = await fetch(`/api/chat-gpt?id=${chatId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userMessage }),
    })

    if (res.ok) {
      const body = await res.text()
      addMessage('assistant', body)
    } else {
      addMessage('assistant', 'The AI did not respond')
    }
  }

  return [messages, sendMessage] as const
}
