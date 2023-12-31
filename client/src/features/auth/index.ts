import {useCallback, useState, useMemo, useEffect} from 'react'
import {useOutletContext} from 'react-router-dom'

export type User = {
  username: string
  first_name: string
  last_name: string
  phone: string
}

const decodePayload = (token: string) => {
  try {
    const payloadBase64 = token.split('.')[1];
    return JSON.parse(window.atob(payloadBase64))
  } catch (err) {
    console.log(`Major flaw in token: ${token}`)
    console.error(err)
  }
  return null
}
export function useAuth() {
  const [token, setToken] = useState<string|null>(null)

  const isAuthenticated = useMemo(() => !!token, [token])

  const storeToken = useCallback((newToken: string) => {
    localStorage.setItem('token', newToken)
    setToken((old) => {
      console.log({old, newToken})
      return newToken
    })
  }, [setToken])
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
  }, [setToken])

  const login = useCallback((newToken: string) => {
    storeToken(newToken)
  }, [storeToken])

  const username = useMemo(() => {
    if (!token || token === '') {return null}
    try {
      const {username} = decodePayload(token)??{username: null}
      return username as string | null
    } catch (err) {
      console.log(`Major flaw in token: ${token}`)
      console.error(err)
      return null
    }
  }, [token])

  useEffect(() => {
    console.log(`useAuth load: ${token}`)
    const localToken = localStorage.getItem('token')
    if (localToken && localToken !== token ) {
      console.log('effect setting token')
      setToken(localToken)
    }
  }, [token])

  
  console.log(`useAuth rerender: ${token}`)
  return {
    isAuthenticated,
    username,
    token,
    storeToken,
    logout,
    login
  }
}

export function useAuthFromOutlet() {
  const context = useOutletContext()
  return context as ReturnType<typeof useAuth>
}