import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import Session from 'supertokens-web-js/recipe/session'
import { useEffect, useState } from 'react'

import { HeaderBar } from './components/header-bar/HeaderBar'
import { HomePage } from './pages/home/HomePage'
import { ChatPage } from './pages/chat/ChatPage'
import { ListChatsPage } from './pages/list-chats/ListChatsPage'
import { SignInPage } from './pages/sign-in/SignInPage'
import { NewChat } from './pages/new-chat/NewChat'

const AppRoot = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

export function MainRouter() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
  useEffect(() => {
    Session.doesSessionExist().then((exists) => {
      setLoggedIn(exists)
    })
  }, [])

  if (loggedIn === null) {
    return <div>Loading...</div>
  }

  if (!loggedIn) {
    return (
      <AppRoot>
        <BrowserRouter>
          <HeaderBar />
          <Routes>
            <Route path="/page/sign-up" element={<SignInPage signUp />} />
            <Route path="*" element={<SignInPage />} />
          </Routes>
        </BrowserRouter>
      </AppRoot>
    )
  }

  return (
    <AppRoot>
      <BrowserRouter>
        <HeaderBar signedIn />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/page/new-chat" element={<NewChat />} />
          <Route path="/page/chat/:id" element={<ChatPage />} />
          <Route path="/page/list-chats" element={<ListChatsPage />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </BrowserRouter>
    </AppRoot>
  )
}
