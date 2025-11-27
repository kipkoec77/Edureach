import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, roles }){
  const { user, loading } = useAuth()

  // Wait until auth state finishes loading
  if (loading) return null

  // Not signed in -> redirect to login page
  if (!user) return <Navigate to="/login" replace />

  // If roles are required, check user role
  if (roles && roles.length) {
    const role = user?.role
    if (!role || !roles.includes(role)) return <Navigate to="/" replace />
  }

  return children
}
