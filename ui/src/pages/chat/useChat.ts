import { useEffect, useRef, useState } from 'react'
import { useLocalCache } from '../../hooks/useLocalCache'
import { getChat, restartChat } from '../../helpers/api-client'

export type ChatRole = 'assistant' | 'user' | 'system'
interface ChatHistory {
  role: ChatRole
  content: string
}

interface ChatRecord {
  id: string
  owner: string
  created: string
  summary: string
  chat: ChatHistory[]
}

function isChatRecord(arg: unknown): arg is ChatRecord {
  const a = arg as ChatRecord
  if (typeof a.id !== 'string') return false
  if (typeof a.owner !== 'string') return false
  if (typeof a.created !== 'string') return false
  if (typeof a.summary !== 'string') return false
  if (!Array.isArray(a.chat)) return false
  return true
}

const loadingChat: ChatRecord = {
  id: '',
  owner: '',
  created: '',
  summary: '',
  chat: [{ role: 'system', content: 'Loading chat...' }],
}

// function pause(seconds: number) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, seconds * 1000)
//   })
// }

let nextHookId = 0

export function useChat(chatId: string) {
  const hookId = nextHookId++
  const {
    value: cachedChat,
    isReady,
    updateCache,
    startInvalidating,
    reloadCache,
  } = useLocalCache<ChatRecord>(
    isChatRecord,
    `chat.${chatId}`,
    loadingChat,
    () => getChat(chatId, `useChat.${hookId}`),
  )

  const messageRef = useRef<ChatHistory[]>(cachedChat.chat)
  const [messages, setMessages] = useState<ChatHistory[]>(cachedChat.chat)
  const [messagePending, setMessagePending] = useState(false)

  useEffect(() => {
    if (isReady) {
      messageRef.current = cachedChat.chat
      setMessages(cachedChat.chat)
    }
  }, [isReady])

  const addMessage = (
    role: ChatRole,
    content: string,
    shouldUpdateCache?: boolean,
  ) => {
    messageRef.current = [...messageRef.current, { role, content }]
    setMessages(messageRef.current)
    if (shouldUpdateCache) {
      updateCache((oldChat) => {
        return {
          ...oldChat,
          chat: messageRef.current,
        }
      })
    }
  }

  const sendMessage = async (userMessage: string) => {
    const trimmedMessage = userMessage.trim()
    if (trimmedMessage === '') {
      addMessage('system', 'Can not send empty message')
      return
    }

    const snapshot = messageRef.current
    addMessage('user', trimmedMessage)
    setMessagePending(true)

    const res = await fetch(`/api/chat-gpt?id=${chatId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userMessage: trimmedMessage }),
    })

    if (res.ok) {
      const body = await res.text()
      setMessagePending(false)
      addMessage('assistant', body, true)
      return true
    } else {
      setMessagePending(false)
      messageRef.current = snapshot
      setMessages(messageRef.current)
      addMessage('system', 'The AI did not respond')
      return false
    }
  }

  const restart = async () => {
    await startInvalidating()
    await restartChat(chatId)
    await reloadCache()
  }

  return [messages, sendMessage, messagePending, isReady, restart] as const
}
