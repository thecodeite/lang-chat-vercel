const requests: Record<string, Promise<any>> = {}

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
