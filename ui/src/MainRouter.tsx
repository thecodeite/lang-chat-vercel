import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import styled from 'styled-components'
import Session from 'supertokens-web-js/recipe/session'
import { UserRoleClaim } from 'supertokens-web-js/recipe/userroles'

import { HeaderBar } from './components/header-bar/HeaderBar'
import { HomePage } from './pages/home/HomePage'
import { ChatPage } from './pages/chat/ChatPage'
import { ListChatsPage } from './pages/list-chats/ListChatsPage'
import { SignPage } from './pages/sign/SignPage'
import { NewChatPage } from './pages/new-chat/NewChatPage'
import { ChatAdminPage } from './pages/chat-admin/ChatAdminPage'
import { ChatAdminPageDetail } from './pages/chat-admin/ChatAdminPageDetail'
import { useLocalCache } from './hooks/useLocalCache'

const AppRoot = styled.div`
  height: 100%;
`

type SignedInState = 'no-session' | 'no-details' | 'signed-in'

export function MainRouter() {
  // Move this and isAdmin to a common hook
  const { value: signedInState } = useLocalCache<SignedInState | null>(
    (value): value is SignedInState =>
      value === 'no-session' || value === 'no-details' || value === 'signed-in',
    'signedInState',
    null,
    async () => {
      const hasSession = await Session.doesSessionExist()
      if (!hasSession) {
        return 'no-session'
      }

      const validationErrors = await Session.validateClaims({
        overrideGlobalClaimValidators: (globalValidators) => [
          ...globalValidators,
          UserRoleClaim.validators.includes('hasDetails'),
        ],
      })

      if (validationErrors.length > 0) {
        return 'no-details'
      }

      return 'signed-in'
    },
  )

  if (signedInState === null) {
    return <div>Loading session...</div>
  }

  if (signedInState === 'no-session') {
    return (
      <AppRoot>
        <BrowserRouter>
          <HeaderBar />
          <Routes>
            <Route path="/" element={<Navigate to="/page/sign-in" replace />} />
            <Route
              path="/page/sign-up"
              element={<SignPage pageMode="sign-up" />}
            />
            <Route
              path="/page/sign-in"
              element={<SignPage pageMode="sign-in" />}
            />
            <Route path="*" element={<Navigate to="/page/sign-in" replace />} />
          </Routes>
        </BrowserRouter>
      </AppRoot>
    )
  }

  if (signedInState === 'no-details') {
    return (
      <AppRoot>
        <BrowserRouter>
          <HeaderBar />
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/page/add-details" replace />}
            />
            <Route
              path="/page/add-details"
              element={<SignPage pageMode="add-details" />}
            />
            <Route
              path="*"
              element={<Navigate to="/page/add-details" replace />}
            />
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
          <Route path="/page/new-chat" element={<NewChatPage />} />
          <Route path="/page/chat/:id" element={<ChatPage />} />
          <Route path="/page/list-chats" element={<ListChatsPage />} />
          <Route path="/page/chat-admin" element={<ChatAdminPage />} />
          <Route path="/page/sign-up" element={<Navigate to="/" replace />} />
          <Route path="/page/sign-in" element={<Navigate to="/" replace />} />
          <Route
            path="/page/add-details"
            element={<Navigate to="/" replace />}
          />
          <Route
            path="/page/chat-admin/:id"
            element={<ChatAdminPageDetail />}
          />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </BrowserRouter>
    </AppRoot>
  )
}
