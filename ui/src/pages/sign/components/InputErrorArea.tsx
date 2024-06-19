import { FormFieldProblem } from '../auth-actions'

export function InputErrorArea({
  name,
  errors,
}: {
  name: string
  errors: FormFieldProblem[]
}) {
  const fieldErrors = errors.filter((e) => e.formElement === name)
  if (fieldErrors.length === 0) return null

  return (
    <div>
      {fieldErrors.map((e) => (
        <div key={e.errorMessage}>{e.errorMessage}</div>
      ))}
    </div>
  )
}
