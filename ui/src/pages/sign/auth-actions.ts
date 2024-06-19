import { signIn, signUp } from 'supertokens-web-js/recipe/emailpassword'
import { addDetails } from '../../helpers/api-client'
import { attemptRefreshingSession } from 'supertokens-web-js/recipe/session'

export interface FormFieldProblem {
  formElement: string
  errorMessage: string
}

function globalProblems(...message: string[]): FormFieldProblem[] {
  return message.map((message) => ({
    formElement: ':global',
    errorMessage: message,
  }))
}

export async function signInClicked(
  email: string,
  password: string,
): Promise<FormFieldProblem[]> {
  try {
    const response = await signIn({
      formFields: [
        {
          id: 'email',
          value: email,
        },
        {
          id: 'password',
          value: password,
        },
      ],
    })

    console.log('response:', response)

    if (response.status === 'FIELD_ERROR') {
      return response.formFields.map((formField) => ({
        formElement: formField.id,
        errorMessage: formField.error,
      }))
    } else if (response.status === 'WRONG_CREDENTIALS_ERROR') {
      return globalProblems('Email password combination is incorrect.')
    } else if (response.status === 'SIGN_IN_NOT_ALLOWED') {
      // the reason string is a user friendly message
      // about what went wrong. It can also contain a support code which users
      // can tell you so you know why their sign in was not allowed.
      return globalProblems(response.reason)
    } else {
      // sign in successful. The session tokens are automatically handled by
      // the frontend SDK.
      return []
    }
  } catch (err: unknown) {
    if (isSuperTokensGeneralError(err)) {
      // this may be a custom error message sent from the API by you.
      return globalProblems(err.message)
    } else {
      return globalProblems('Oops! Something went wrong.')
    }
  }
}

export async function signUpClicked(fields: {
  email: string
  password: string
}): Promise<FormFieldProblem[]> {
  try {
    const formFields = Object.entries(fields).map(([id, value]) => ({
      id,
      value,
      // optional: /email|password/.test(id) ? undefined : true,
    }))
    const response = await signUp({
      formFields,
    })

    if (response.status === 'FIELD_ERROR') {
      // one of the input formFields failed validation
      return response.formFields.map((formField) => ({
        formElement: formField.id,
        errorMessage: formField.error,
      }))
    } else if (response.status === 'SIGN_UP_NOT_ALLOWED') {
      // the reason string is a user friendly message
      // about what went wrong. It can also contain a support code which users
      // can tell you so you know why their sign up was not allowed.
      return globalProblems(response.reason)
    } else {
      // sign up successful. The session tokens are automatically handled by
      // the frontend SDK.
      // alert('Signup success')
      return []
    }
  } catch (err: unknown) {
    if (isSuperTokensGeneralError(err)) {
      // this may be a custom error message sent from the API by you.
      return globalProblems(err.message)
    } else {
      return globalProblems('Oops! Something went wrong.')
    }
  }
}

export async function addDetailsClicked(
  name: string,
  code: string,
): Promise<FormFieldProblem[]> {
  const result = await addDetails(name, code)

  await attemptRefreshingSession()

  return result as FormFieldProblem[]
}

interface SuperTokensGeneralError {
  isSuperTokensGeneralError: true
  message: string
}

function isSuperTokensGeneralError(
  err: unknown,
): err is SuperTokensGeneralError {
  if (err === null || typeof err !== 'object') {
    return false
  }
  return (err as SuperTokensGeneralError).isSuperTokensGeneralError === true
}
