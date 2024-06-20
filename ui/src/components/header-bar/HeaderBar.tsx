import styled from 'styled-components'
import { signOut } from 'supertokens-web-js/recipe/session'

import { GiHamburgerMenu } from 'react-icons/gi'
import { FaUser } from 'react-icons/fa'
import { useState } from 'react'
import { useNavTo } from '../../helpers/navTo'
import { useIsAdmin } from '../../hooks/useIsAdmin'

const HeaderBarContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 4px;
  background-color: var(--main-bg-color);
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

const ButtonBase = styled.button`
  background-color: var(--secondary-action-color);
  color: var(--secondary-action-contrast);
  border: 1px solid var(--main-border-color);
  cursor: pointer;
`

const MainMenuButton = styled(ButtonBase)`
  display: block;

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

const UserButton = styled(ButtonBase)`
  display: block;

  width: 4rem;
  height: 4rem;

  border-radius: 50%;

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
    right: 80px;
    flex-direction: column;
    background-color: var(--main-bg-color);
    border-radius: 8px;
    padding: 0px 8px;
    border: 1px solid var(--main-border-color);
  }

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }
`

const Middle = styled.div`
  flex-grow: 1;
`

const UserItems = styled.div<{ $show: boolean }>`
  @media (max-width: 767px) {
    display: ${(p) => (p.$show ? 'flex' : 'none')};
    position: absolute;
    top: calc(4rem + 16px);
    left: 80px;
    right: 8px;
    flex-direction: column;
    background-color: var(--main-bg-color);
    border-radius: 8px;
    padding: 0px 8px;
    border: 1px solid var(--main-border-color);
  }

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }
`

const HeaderItem = styled.div`
  @media (min-width: 768px) {
    padding: 4px;
    margin-left: 16px;
    margin-right: 16px;
    cursor: pointer;

    &:hover {
      background-color: var(--main-bg-color);
      color: var(--main-fg-color);
    }
  }
`

const HeaderInfo = styled.div`
  margin-left: auto;
  align-self: center;

  @media (min-width: 768px) {
    display: none;
  }
`

export function HeaderBar({ signedIn }: { signedIn?: boolean }) {
  const [menu, setMenu] = useState<'none' | 'main' | 'user'>('none')
  const isAdmin = useIsAdmin()
  const navTo = useNavTo()

  return (
    <>
      <HeaderBarContainer>
        {signedIn && (
          <>
            <MainMenuButton
              onClick={() => setMenu((x) => (x === 'main' ? 'none' : 'main'))}
            >
              <GiHamburgerMenu />
            </MainMenuButton>

            <HeaderItems $show={menu === 'main'}>
              <HeaderItem
                onClick={() => {
                  setMenu('none')
                  navTo('Home')
                }}
              >
                Home
              </HeaderItem>
              <HeaderItem
                onClick={() => {
                  setMenu('none')
                  navTo('NewChat')
                }}
              >
                New Chat
              </HeaderItem>
              <HeaderItem
                onClick={() => {
                  setMenu('none')
                  navTo('ListChats')
                }}
              >
                Old Chats
              </HeaderItem>
              {isAdmin && (
                <HeaderItem
                  onClick={() => {
                    setMenu('none')
                    navTo('ChatAdmin')
                  }}
                >
                  Admin
                </HeaderItem>
              )}
            </HeaderItems>
            <Middle />

            <UserItems $show={menu === 'user'}>
              <HeaderItem
                onClick={() => {
                  setMenu('none')
                  navTo('Account')
                }}
              >
                Account
              </HeaderItem>
              <HeaderItem
                onClick={async () => {
                  await signOut()
                  setTimeout(() => {
                    window.location.href = `/?sign-out=${Date.now()}`
                  }, 100)
                }}
              >
                Sign out
              </HeaderItem>
            </UserItems>

            <HeaderInfo>
              <UserButton
                onClick={() => setMenu((x) => (x === 'user' ? 'none' : 'user'))}
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
