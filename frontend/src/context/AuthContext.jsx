import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi, tokenStore, setUnauthorizedHandler } from '../services/api.js'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => { tokenStore.clear(); setUser(null) }, [])

  useEffect(() => { setUnauthorizedHandler(logout) }, [logout])

  // restore session from stored token
  useEffect(() => {
    if (!tokenStore.get()) { setLoading(false); return }
    authApi.me().then(setUser).catch(() => tokenStore.clear()).finally(() => setLoading(false))
  }, [])

  const acceptAuth = ({ token, user }) => { tokenStore.set(token); setUser(user); return user }
  const login = async (email, password, portal) => acceptAuth(await authApi.login(email, password, portal))
  const register = async (form) => acceptAuth(await authApi.register(form))

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}
