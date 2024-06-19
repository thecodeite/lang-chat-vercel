import styled from 'styled-components'
import { signOut } from 'supertokens-web-js/recipe/session'

import { GiHamburgerMenu } from 'react-icons/gi'
import { FaUser } from 'react-icons/fa'
import { useState } from 'react'
import { useNavTo } from '../../helpers/navTo'

const HeaderBarContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 4px;
  background-color: var(--accent-bg-color);
  background-image: url('/logo.svg');
  background-repeat: no-repeat;
  background-position-x: center;
  margin: 0;
  border-bottom: 1px solid var(--main-border-color);

  font-size: 3rem;
  height: 5rem;
`

const SpaceUnderBar = styled.div`
  height: 5rem;
`

const MainMenuButton = styled.button`
  display: block;
  color: var(--main-fg-color);
  background-color: var(--accent-fg-color);
  border: 1px solid var(--main-border-color);

  width: 4rem;
  height: 4rem;

  @media (min-width: 768px) {
    display: none;
  }
  svg {
    width: 100%;
    height: 100%;
  }
`

const UserButton = styled.button`
  display: block;

  width: 4rem;
  height: 4rem;

  border-radius: 50%;
  color: var(--main-fg-color);
  background-color: var(--accent-fg-color);
  border: 1px solid var(--main-border-color);

  cursor: pointer;
  svg {
    width: 80%;
    height: 80%;
  }
`

const HeaderItems = styled.div<{ $show: boolean }>`
  @media (max-width: 767px) {
    display: ${(p) => (p.$show ? 'flex' : 'none')};
    position: absolute;
    top: calc(4rem + 16px);
    left: 8px;
    right: 8px;
    flex-direction: column;
    background-color: var(--accent-bg-color);
    border-radius: 8px;
    padding: 0px 8px;
    border: 1px solid var(--main-border-color);
  }

  @media (min-width: 768px) {
    display: flex;
  }
`

const HeaderItem = styled.div`
  @media (min-width: 768px) {
    padding: 4px;
    margin-left: 16px;
    cursor: pointer;

    &:hover {
      background-color: var(--accent-fg-color);
      color: var(--main-fg-color);
    }
  }
`

const HeaderInfo = styled.div`
  margin-left: auto;
  align-self: center;
`

export function HeaderBar({ signedIn }: { signedIn?: boolean }) {
  const [showMenu, setShowMenu] = useState(false)
  const navTo = useNavTo()

  return (
    <>
      <HeaderBarContainer>
        {signedIn && (
          <>
            <MainMenuButton onClick={() => setShowMenu((x) => !x)}>
              <GiHamburgerMenu />
            </MainMenuButton>

            <HeaderItems $show={showMenu}>
              <HeaderItem
                onClick={() => {
                  setShowMenu(false)
                  navTo('Home')
                }}
              >
                Home
              </HeaderItem>
              <HeaderItem
                onClick={() => {
                  setShowMenu(false)
                  navTo('NewChat')
                }}
              >
                New Chat
              </HeaderItem>
              <HeaderItem
                onClick={() => {
                  setShowMenu(false)
                  navTo('ListChats')
                }}
              >
                Old Chats
              </HeaderItem>
            </HeaderItems>

            <HeaderInfo>
              <UserButton
                onClick={async () => {
                  await signOut()
                  setTimeout(() => {
                    window.location.href = `/?sign-out=${Date.now()}`
                  }, 100)
                }}
              >
                <FaUser />
              </UserButton>
            </HeaderInfo>
          </>
        )}
      </HeaderBarContainer>
      <SpaceUnderBar>Space</SpaceUnderBar>
    </>
  )
}
