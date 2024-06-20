import styled from 'styled-components'
import { useNavTo } from '../../helpers/navTo'

import { signOut } from 'supertokens-web-js/recipe/session'
import { LinkButton } from '../../components/atoms/LinkButton'
import { LayoutSignUp } from './LayoutSignUp'
import { LayoutSignIn } from './LayoutSignIn'
import { LayoutAddDetails } from './LayoutAddDetails'

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
  background-color: var(--main-bg-color);
  border-radius: 8px;
  border: 1px solid var(--main-border-color);
  max-width: 500px;
`

// #endregion

export function SignPage({
  pageMode,
}: {
  pageMode: 'sign-in' | 'sign-up' | 'add-details'
}) {
  const navTo = useNavTo()

  const isSignedIn = false as boolean
  const switchToSignIn = () => navTo('Home')
  const switchToSignUp = () => navTo('SignUp')

  const handleOnSuccess = () => {
    window.location.href = `/?signedIn=true&time=${Date.now()}`
  }

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
          <LayoutSignIn
            switchToSignUp={switchToSignUp}
            onSuccess={handleOnSuccess}
          />
        )}
        {pageMode === 'sign-up' && (
          <LayoutSignUp
            switchToSignIn={switchToSignIn}
            onSuccess={handleOnSuccess}
          />
        )}
        {pageMode === 'add-details' && (
          <LayoutAddDetails onSuccess={handleOnSuccess} />
        )}
      </Box>
    </Background>
  )
}
