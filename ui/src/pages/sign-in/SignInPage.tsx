import { useState } from 'react'
import styled from 'styled-components'
import { useNavTo } from '../../helpers/navTo'

import { signOut } from 'supertokens-web-js/recipe/session'
import { LinkButton } from '../../components/atoms/LinkButton'
import { signInClicked, signUpClicked } from './auth-actions'

// #region CSS

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`

const Box = styled.div`
  display: flex;
  flex: 1;
  margin: 32px 16px;
  flex-direction: column;
  padding: 20px;
  background-color: var(--accent-bg-color);
  border-radius: 8px;
  border: 1px solid var(--main-border-color);
  max-width: 500px;
`

const HeaderTabs = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
  margin: -20px -20px 20px -20px;
`

const HeaderTab = styled.div`
  flex: 1;
  padding: 0;
  margin: 0;
  padding: 8px 24px;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  border-bottom: 1px solid var(--main-border-color);
`

const HeaderTabInactive = styled.button`
  flex: 1;
  padding: 0;
  margin: 0;
  padding: 8px 24px;
  font-weight: bold;
  font-size: 20px;
  border-radius: 8px 8px 0 0;
  border: 0;
  color: var(--disabled-fg-color);
  background-color: var(--disabled-bg-color);
  text-align: center;
  border-bottom: 1px solid var(--main-border-color);
`

const HeaderTabInactiveLeft = styled(HeaderTabInactive)`
  border-radius: 8px 0 0 0;
  // An inset shadow on the left edge
  /* box-shadow: inset -3px -3px 10px var(--shadow-color); */
  border-right: 1px solid var(--main-border-color);
`
const HeaderTabInactiveRight = styled(HeaderTabInactive)`
  border-radius: 0 8px 0 0;
  // An inset shadow on the left edge
  /* box-shadow: inset 3px -3px 10px var(--shadow-color); */
  border-left: 1px solid var(--main-border-color);
`

const SignUpText = styled.p`
  font-size: 12px;
  margin: 0;
  padding: 0;
  color: var(--main-fg-color);
  margin-bottom: 16px;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 16px 0;
`
const InputLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  padding: 0;
  line-height: 1;
`

const Input = styled.input`
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--main-border-color);
  background-color: var(--main-bg-color);
  color: var(--main-fg-color);
  width: 100%;
  font-size: 16px;
`

const SignInButton = styled.button`
  padding: 10px;
  border-radius: 10px;
  border: none;
  background-color: var(--accent-fg-color);
  color: var(--main-fg-color);
  cursor: pointer;
`

// #endregion

export function SignInPage({ signUp }: { signUp?: boolean }) {
  const navTo = useNavTo()
  const pageMode = signUp ? 'sign-up' : 'sign-in'

  const isSignedIn = false as boolean
  const switchToSignIn = () => navTo('Home')
  const switchToSignUp = () => navTo('SignUp')

  if (isSignedIn === null) return <div>Loading...</div>

  if (isSignedIn === true)
    return (
      <div>
        Signed in. <LinkButton onClick={() => signOut()}>Sign out?</LinkButton>
      </div>
    )

  return (
    <Background>
      <Box>
        {pageMode === 'sign-in' && (
          <SignInLayout switchToSignUp={switchToSignUp} />
        )}
        {pageMode === 'sign-up' && (
          <SignUpLayout switchToSignIn={switchToSignIn} />
        )}
      </Box>
    </Background>
  )
}

function SignInLayout({ switchToSignUp }: { switchToSignUp: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signInClicked(email, password)
  }

  return (
    <>
      <HeaderTabs>
        <HeaderTab>Sign in</HeaderTab>
        <HeaderTabInactiveRight onClick={() => switchToSignUp()}>
          Sign up
        </HeaderTabInactiveRight>
      </HeaderTabs>
      <SignUpText>
        Not yet registered?{' '}
        <LinkButton onClick={() => switchToSignUp()}>Sign up</LinkButton>
      </SignUpText>

      <form onSubmit={handleSubmit}>
        <InputGroup>
          <InputLabel htmlFor="sign-in-page_login-form_email">
            Email address
          </InputLabel>
          <Input
            type="email"
            id="sign-in-page_login-form_email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <InputLabel htmlFor="sign-in-page_login-form_password">
            Password
          </InputLabel>
          <Input
            type="password"
            id="sign-in-page_login-form_new-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <SignInButton type="submit">Sign in</SignInButton>
        </InputGroup>
      </form>
    </>
  )
}

function SignUpLayout({ switchToSignIn }: { switchToSignIn: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signUpClicked(email, password)
  }

  return (
    <>
      <HeaderTabs>
        <HeaderTabInactiveLeft onClick={() => switchToSignIn()}>
          Sign in
        </HeaderTabInactiveLeft>
        <HeaderTab>Sign up</HeaderTab>
      </HeaderTabs>
      <SignUpText>
        Already registered?{' '}
        <LinkButton onClick={() => switchToSignIn()}>Sign in</LinkButton>
      </SignUpText>

      <form onSubmit={handleSubmit}>
        <InputGroup>
          <InputLabel htmlFor="sign-in-page_login-form_name">
            Full name
          </InputLabel>
          <Input
            type="text"
            id="sign-in-page_login-form_name"
            placeholder="E.g. Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <InputLabel htmlFor="sign-in-page_login-form_code">
            Organisation code
          </InputLabel>
          <Input
            type="text"
            id="sign-in-page_login-form_code"
            placeholder="E.g. LCxxxxxxx-01"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <InputLabel htmlFor="sign-in-page_login-form_email">
            Email address
          </InputLabel>
          <Input
            type="email"
            id="sign-in-page_login-form_email"
            placeholder="user@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <InputLabel htmlFor="sign-in-page_login-form_new-password">
            Password
          </InputLabel>
          <Input
            type="password"
            name="new-password"
            id="sign-in-page_login-form_password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <SignInButton type="submit">Sign up</SignInButton>
        </InputGroup>
      </form>
    </>
  )
}
