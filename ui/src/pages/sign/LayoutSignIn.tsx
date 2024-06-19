import { useState } from 'react'
import styled from 'styled-components'
import { LinkButton } from '../../components/atoms/LinkButton'
import { FormFieldProblem, signInClicked } from './auth-actions'
import {
  HeaderTabInactive,
  HeaderTabs,
  HeaderTab,
  SignInButton,
  InstructionsText,
  InputGroup,
} from './components/StyledElements'
import { FormInputGroup } from './components/FormInputGroup'
import { InputErrorArea } from './components/InputErrorArea'

const HeaderTabInactiveRight = styled(HeaderTabInactive)`
  border-radius: 0 8px 0 0;
  // An inset shadow on the left edge
  /* box-shadow: inset 3px -3px 10px var(--shadow-color); */
  border-left: 1px solid var(--main-border-color);
`

export function LayoutSignIn({
  switchToSignUp,
  onSuccess,
}: {
  switchToSignUp: () => void
  onSuccess: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormFieldProblem[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await signInClicked(email, password)
    if (result.length > 0) {
      setErrors(result)
    } else {
      onSuccess()
    }
  }

  return (
    <>
      <HeaderTabs>
        <HeaderTab>Sign in</HeaderTab>
        <HeaderTabInactiveRight onClick={() => switchToSignUp()}>
          Sign up
        </HeaderTabInactiveRight>
      </HeaderTabs>
      <InstructionsText>
        Not yet registered?{' '}
        <LinkButton onClick={() => switchToSignUp()}>Sign up</LinkButton>
      </InstructionsText>

      <form onSubmit={handleSubmit}>
        <FormInputGroup
          label="Email address"
          name="email"
          placeholder="user@domain.com"
          state={[email, setEmail]}
          type="email"
          errors={errors}
        />
        <FormInputGroup
          label="Password"
          name="password"
          state={[password, setPassword]}
          type="password"
          errors={errors}
        />

        <InputGroup>
          <SignInButton type="submit">Sign in</SignInButton>
          <InputErrorArea name=":global" errors={errors} />
        </InputGroup>
      </form>
    </>
  )
}
