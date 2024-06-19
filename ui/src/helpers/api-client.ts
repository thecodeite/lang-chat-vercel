export interface ChatRecord {
  id: string
  owner: string
  created: string
  summary: string
  chat: ChatHistory[]
}

export interface ChatHistory {
  role: ChatRole
  content: string
}

export type ChatRole = 'assistant' | 'user' | 'system'

const requests: Record<string, Promise<ChatRecord>> = {}

export function getChat(chatId: string, requestId: string) {
  const key = `${requestId}-${chatId}`
  if (!requests[key]) {
    requests[key] = fetch(`/api/chat?id=${chatId}`).then((res) => res.json())
  }
  return requests[key]
}

export function restartChat(chatId: string) {
  return fetch(`/api/restart-chat?id=${chatId}`)
}

export function addDetails(name: string, code: string) {
  return fetch(`/api/user/add-details?name=${name}&code=${code}`).then((res) =>
    res.json(),
  )
}
