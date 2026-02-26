import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { getCurrentUser } from '../api/auth.api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined) // undefined = not checked yet
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    getCurrentUser()
      .then((res) => setUser(res.data?.data))
      .catch(() => setUser(null))
  }, [])

  const loading = user === undefined

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)