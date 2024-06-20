import { useEffect, useRef, useState } from 'react'
import { useLocalCache } from '../../hooks/useLocalCache'
import {
  ChatHistory,
  ChatRecord,
  ChatRole,
  getChat,
  restartChat,
  sendChatGPT,
} from '../../helpers/api-client'

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
    isFresh,
    ...chatCache
  } = useLocalCache<ChatRecord>(
    isChatRecord,
    `chat.${chatId}`,
    loadingChat,
    () => getChat(chatId, `useChat.${hookId}`),
  )

  const messageRef = useRef<ChatHistory[]>(cachedChat.chat)
  const [messages, setMessages] = useState<ChatHistory[]>(cachedChat.chat)
  const [messagePending, setMessagePending] = useState(false)
  const wasFresh = useRef(false)

  useEffect(() => {
    // run this only once when the chat transitions from stale to fresh
    // running after that could overwrite new state
    // TODO: Maybe refactor to return two values, one preliminary and one final?
    if (wasFresh.current === false && isFresh) {
      messageRef.current = cachedChat.chat
      setMessages(cachedChat.chat)
      wasFresh.current = true
    }
  }, [isFresh, cachedChat.chat])

  const addMessage = (
    role: ChatRole,
    content: string,
    shouldUpdateCache?: boolean,
    response?: string,
  ) => {
    messageRef.current = [...messageRef.current, { role, content, response }]
    setMessages(messageRef.current)
    if (shouldUpdateCache) {
      chatCache.updateCache((oldChat) => {
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

    // const res = await fetch(`/api/chat-gpt?id=${chatId}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ userMessage: trimmedMessage }),
    // })

    const response = await sendChatGPT(chatId, trimmedMessage)

    if (response !== null) {
      setMessagePending(false)
      messageRef.current = snapshot
      setMessages(messageRef.current)
      addMessage('user', trimmedMessage, true, response.teacherResponse)
      addMessage('teacher', response.teacherResponse, true)
      addMessage('assistant', response.chatResponse, true)
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
    await chatCache.startInvalidating()
    await restartChat(chatId)
    await chatCache.reloadCache()
  }

  return [messages, sendMessage, messagePending, isFresh, restart] as const
}
