import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const WelcomeText = styled.p`
  font-size: 24px;
  width: 100%;
  max-width: 400px;
  margin: 32px auto;
  padding: 0;
  color: var(--main-fg-color);
  background-color: var(--accent-bg-color);
  text-align: center;
`

export function HomePage() {
  return (
    <>
      <WelcomeText>This is the Lang Chat app!</WelcomeText>
      <WelcomeText>
        Get started by trying a <NavLink to="/new-chat">New Chat</NavLink>
      </WelcomeText>

      <WelcomeText>
        Or maybe you want to continue one of your{' '}
        <NavLink to="/list-chats">Old Chats</NavLink>?
      </WelcomeText>
    </>
  )
}
