import { useState } from 'react'
import { LinkButton } from '../../components/atoms/LinkButton'
import { FormFieldProblem, signUpClicked } from './auth-actions'
import {
  HeaderTabInactive,
  HeaderTabs,
  HeaderTab,
  SignInButton,
  InstructionsText,
  InputGroup,
} from './components/StyledElements'
import styled from 'styled-components'
import { FormInputGroup } from './components/FormInputGroup'
import { InputErrorArea } from './components/InputErrorArea'

const HeaderTabInactiveLeft = styled(HeaderTabInactive)`
  border-radius: 8px 0 0 0;
  // An inset shadow on the left edge
  /* box-shadow: inset -3px -3px 10px var(--shadow-color); */
  border-right: 1px solid var(--main-border-color);
`

export function LayoutSignUp({
  switchToSignIn,
  onSuccess,
}: {
  switchToSignIn: () => void
  onSuccess: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormFieldProblem[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await signUpClicked({ email, password })
    if (result.length > 0) {
      setErrors(result)
    } else {
      onSuccess()
    }
  }

  return (
    <>
      <HeaderTabs>
        <HeaderTabInactiveLeft onClick={() => switchToSignIn()}>
          Sign in
        </HeaderTabInactiveLeft>
        <HeaderTab>Sign up</HeaderTab>
      </HeaderTabs>
      <InstructionsText>
        Already registered?{' '}
        <LinkButton onClick={() => switchToSignIn()}>Sign in</LinkButton>
      </InstructionsText>

      <form onSubmit={handleSubmit}>
        <FormInputGroup
          label="Email address"
          name="new-email"
          placeholder="user@domain.com"
          state={[email, setEmail]}
          type="email"
          errors={errors}
        />
        <FormInputGroup
          label="Password"
          name="new-password"
          state={[password, setPassword]}
          type="password"
          errors={errors}
        />

        <InputGroup>
          <SignInButton type="submit">Sign up</SignInButton>
          <InputErrorArea name=":global" errors={errors} />
        </InputGroup>
      </form>
    </>
  )
}
