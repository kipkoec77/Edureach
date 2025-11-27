import React, { createContext, useContext, useEffect, useState } from 'react'
import API from '../services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('edureach_user')
      return raw ? JSON.parse(raw) : null
    } catch (e) { return null }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) localStorage.setItem('edureach_user', JSON.stringify(user));
    else localStorage.removeItem('edureach_user');
  }, [user])

  const login = async ({ email, password }) => {
    setLoading(true)
    try {
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('accessToken', res.data.accessToken)
      localStorage.setItem('refreshToken', res.data.refreshToken)
      setUser(res.data.user)
      setLoading(false)
      return res.data.user
    } catch (err) {
      setLoading(false)
      throw err
    }
  }

  const signup = async ({ name, email, password }) => {
    setLoading(true)
    try {
      const res = await API.post('/auth/signup', { name, email, password })
      localStorage.setItem('accessToken', res.data.accessToken)
      localStorage.setItem('refreshToken', res.data.refreshToken)
      setUser(res.data.user)
      setLoading(false)
      return res.data.user
    } catch (err) {
      setLoading(false)
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
