import { signIn, signUp } from 'supertokens-web-js/recipe/emailpassword'

export async function signInClicked(email: string, password: string) {
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

    if (response.status === 'FIELD_ERROR') {
      response.formFields.forEach((formField) => {
        if (formField.id === 'email') {
          // Email validation failed (for example incorrect email syntax).
          window.alert(formField.error)
        }
      })
    } else if (response.status === 'WRONG_CREDENTIALS_ERROR') {
      window.alert('Email password combination is incorrect.')
    } else if (response.status === 'SIGN_IN_NOT_ALLOWED') {
      // the reason string is a user friendly message
      // about what went wrong. It can also contain a support code which users
      // can tell you so you know why their sign in was not allowed.
      window.alert(response.reason)
    } else {
      // sign in successful. The session tokens are automatically handled by
      // the frontend SDK.
      window.location.href = '/'
    }
  } catch (err: unknown) {
    if (isSuperTokensGeneralError(err)) {
      // this may be a custom error message sent from the API by you.
      window.alert(err.message)
    } else {
      window.alert('Oops! Something went wrong.')
    }
  }
}

export async function signUpClicked(email: string, password: string) {
  try {
    const response = await signUp({
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

    if (response.status === 'FIELD_ERROR') {
      // one of the input formFields failed validaiton
      response.formFields.forEach((formField) => {
        if (formField.id === 'email') {
          // Email validation failed (for example incorrect email syntax),
          // or the email is not unique.
          window.alert(formField.error)
        } else if (formField.id === 'password') {
          // Password validation failed.
          // Maybe it didn't match the password strength
          window.alert(formField.error)
        }
      })
    } else if (response.status === 'SIGN_UP_NOT_ALLOWED') {
      // the reason string is a user friendly message
      // about what went wrong. It can also contain a support code which users
      // can tell you so you know why their sign up was not allowed.
      window.alert(response.reason)
    } else {
      // sign up successful. The session tokens are automatically handled by
      // the frontend SDK.
      window.location.href = `/?r=${Math.random()}`
      //window.alert('Success')
    }
  } catch (err: unknown) {
    if (isSuperTokensGeneralError(err)) {
      // this may be a custom error message sent from the API by you.
      window.alert(err.message)
    } else {
      window.alert('Oops! Something went wrong.')
    }
  }
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
