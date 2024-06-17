import { useEffect, useState } from 'react'
import Session from 'supertokens-web-js/recipe/session'

interface CachedSession {
  isLoggedIn: boolean
}

function isCachedSession(arg: unknown): arg is CachedSession {
  const a = arg as CachedSession
  return a.isLoggedIn !== undefined
}

export function useCachedSession() {
  const [session, setSession] = useState(() => readLocalStorage())

  useEffect(() => {
    Session.doesSessionExist().then((exists) => {
      setSession({ isLoggedIn: exists })
    })
  }, [])

  return session
}

function readLocalStorage(): CachedSession {
  const sessionString = localStorage.getItem('session')
  if (!sessionString) {
    return { isLoggedIn: false }
  }

  const parsed: unknown = JSON.parse(sessionString)
  if (!isCachedSession(parsed)) {
    return { isLoggedIn: false }
  }

  return parsed as CachedSession
}
