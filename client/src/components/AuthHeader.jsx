import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthHeader(){
  const { user, logout } = useAuth()
  
  return (
    <div className="w-full px-4 py-2 flex justify-end items-center">
      <div className="flex items-center gap-3">
        {!user ? (
          <>
            <Link to="/login" className="px-4 py-2 rounded-md text-sm text-gray-700 bg-white/20 hover:bg-white/30">Sign in</Link>
            <Link to="/signup" className="px-4 py-2 rounded-md text-sm bg-blue-600 text-white">Sign up</Link>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-700">{user.name}</span>
            <button onClick={logout} className="px-4 py-2 rounded-md text-sm text-gray-700 bg-white/20 hover:bg-white/30">Logout</button>
          </>
        )}
      </div>
    </div>
  )
}
