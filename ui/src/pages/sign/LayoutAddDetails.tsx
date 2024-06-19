import { useState } from 'react'
import { FormFieldProblem, addDetailsClicked } from './auth-actions'
import {
  SignInButton,
  InstructionsText,
  InputGroup,
} from './components/StyledElements'
import { FormInputGroup } from './components/FormInputGroup'
import { InputErrorArea } from './components/InputErrorArea'

export function LayoutAddDetails({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [errors, setErrors] = useState<FormFieldProblem[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await addDetailsClicked(name, code)
    setErrors(result)
    if (result.length === 0) {
      onSuccess()
    }
  }

  return (
    <>
      <InstructionsText>
        Your account is almost ready. Please provide your name and organization
        code to confirm access.
      </InstructionsText>

      <form onSubmit={handleSubmit}>
        <FormInputGroup
          label="Full name"
          name="text"
          placeholder="E.g. Jane Doe"
          state={[name, setName]}
          type="text"
          errors={errors}
        />
        <FormInputGroup
          label="Organisation code"
          name="code"
          placeholder="E.g. LCxxxxxxx-01"
          state={[code, setCode]}
          type="text"
          errors={errors}
        />

        <InputGroup>
          <SignInButton type="submit">Add</SignInButton>
          <InputErrorArea name=":global" errors={errors} />
        </InputGroup>
      </form>
    </>
  )
}
