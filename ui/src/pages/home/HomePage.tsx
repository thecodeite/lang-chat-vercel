import styled from 'styled-components'
import { LinkTo } from '../../components/LinkTo'

const WelcomeText = styled.p`
  font-size: 24px;
  width: 100%;
  max-width: 400px;
  margin: 32px auto;
  padding: 0;
  color: var(--main-fg-color);
  background-color: var(--main-bg-color);
  text-align: center;
`

export function HomePage() {
  return (
    <>
      <WelcomeText>This is the Lang Chat app!</WelcomeText>
      <WelcomeText>
        Get started by trying a <LinkTo toPage="NewChat">New Chat</LinkTo>
      </WelcomeText>

      <WelcomeText>
        Or maybe you want to continue one of your{' '}
        <LinkTo toPage="ListChats">Old Chats</LinkTo>?
      </WelcomeText>
    </>
  )
}
