import { useEffect, useState } from 'react'

type IsT<T> = (value: any) => value is T

interface CacheWrapper<T> {
  value: T
  isReady: boolean
}

let nextHookId = 0

export function useLocalCache<T>(
  isT: IsT<T>,
  cacheKey: string,
  defaultValue: T,
  getter: () => Promise<T>,
) {
  const hookId = nextHookId++

  const [state, setState] = useState<CacheWrapper<T>>(() => {
    const local = readLocalStorage(isT, cacheKey)
    if (local === null) {
      return { value: defaultValue, isReady: false }
    } else {
      return { value: local, isReady: false }
    }
  })

  const setCache = (newValue: T) => {
    setState({ value: newValue, isReady: true })
    localStorage.setItem(cacheKey, JSON.stringify(newValue))
  }

  const updateCache = (x: (oldValue: T) => T) => {
    const newValue = x(state.value)
    setCache(newValue)
  }

  const startInvalidating = () => {
    localStorage.removeItem(cacheKey)
    setState({ value: defaultValue, isReady: false })
  }

  const reloadCache = () => {
    getter().then(setCache)
  }

  useEffect(() => {
    console.log(`useLocalCache get ${hookId} ${cacheKey}`)
    getter().then(setCache)
  }, [])

  return { ...state, setCache, updateCache, startInvalidating, reloadCache }
}

function readLocalStorage<T>(isT: IsT<T>, cacheKey: string): T | null {
  const cachedJson = localStorage.getItem(cacheKey)
  if (!cachedJson) {
    return null
  }

  const parsed: unknown = JSON.parse(cachedJson)
  if (!isT(parsed)) {
    return null
  }

  return parsed
}
