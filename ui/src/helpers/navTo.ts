import { useNavigate } from 'react-router-dom'

export const knownPages = {
  Home: '/',
  NewChat: '/page/new-chat',
  ListChats: '/page/list-chats',
  SignUp: '/page/sign-up',
  Account: '/page/account',
  Chat: (...args: string[]) => `/page/chat/${args[0]}`,
  ChatAdmin: '/page/chat-admin',
  ChatAdminDetail: (...args: string[]) => `/page/chat-admin/${args[0]}`,
}

export function useNavTo() {
  const navigate = useNavigate()

  return (path: keyof typeof knownPages, ...args: string[]) => {
    const route = knownPages[path]
    if (typeof route === 'function') {
      const page = route(...args)
      navigate(page)
    } else if (typeof route === 'string') {
      navigate(route)
    }
  }
}
