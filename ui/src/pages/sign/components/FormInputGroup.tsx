import { Input } from './StyledElements'
import { InputLabel } from './StyledElements'
import { InputGroup } from './StyledElements'
import { FormFieldProblem } from '../auth-actions'
import { InputErrorArea } from './InputErrorArea'

export interface FormInputGroupProps extends React.HTMLProps<HTMLInputElement> {
  name: string
  label: string
  state: [string, React.Dispatch<React.SetStateAction<string>>]
  errors: FormFieldProblem[]
}

export function FormInputGroup({
  name,
  label,
  state,
  errors,
  ...inputProps
}: FormInputGroupProps) {
  const labelId = `sign-in-page_login-${name}`
  const [value, setValue] = state
  const hasError = errors.some((e) => e.formElement === name)

  return (
    <InputGroup $hasError={hasError}>
      <InputLabel htmlFor={labelId}>{label}</InputLabel>
      <Input
        id={labelId}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        {...inputProps}
      />
      <InputErrorArea name={name} errors={errors} />
    </InputGroup>
  )
}
