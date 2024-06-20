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

export type ChatRole = 'teacher' | 'assistant' | 'user' | 'system'

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

export interface AllChatList {
  id: string
  owner: string
  created: string
  summary: string
  instructions: string
  name: string
}

export function fetchAllChats(): Promise<AllChatList[]> {
  return fetch('/api/chat-admin').then((res) => res.json())
}

export interface SingleChat {
  id: string
  owner: string
  created: string
  summary: string
  chat: ChatHistory[]
  instructions: string
  name: string
}

export function fetchSingleChat(id: string): Promise<SingleChat> {
  return fetch(`/api/chat-admin-single?id=${id}`).then((res) => res.json())
}

export function putSingleChatProperty(
  id: string,
  field: 'summary' | 'instructions',
  value: string,
) {
  return fetch(`/api/chat-admin-write?id=${id}&field=${field}`, {
    method: 'POST',
    body: value,
  })
}

export interface ChatGPTResponse {
  chatResponse: string
  teacherResponse: string
}

export async function sendChatGPT(
  chatId: string,
  userMessage: string,
): Promise<ChatGPTResponse | null> {
  const res = await fetch(`/api/chat-gpt?id=${chatId}`, {
    method: 'POST',
    body: userMessage,
  })
  if (!res.ok) {
    return null
  }
  return res.json()
}
