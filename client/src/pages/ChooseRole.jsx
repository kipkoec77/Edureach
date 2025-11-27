import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ChooseRole(){
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  async function pick(role){
    // Note: Role changes now require backend API update
    // This is a simplified placeholder - actual implementation depends on your backend
    try{
      alert('Role selection via this page is deprecated. Roles are set during registration.')
      if (user.role === 'student') navigate('/student')
      else if (user.role === 'tutor') navigate('/tutor')
      else navigate('/')
    } catch (err) {
      console.error(err)
      alert('Failed to navigate')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-xl w-full p-6 bg-white rounded shadow text-center">
        <h2 className="text-xl font-semibold mb-4">Tell us who you are</h2>
        <p className="text-sm text-gray-600 mb-6">Choose a role so we can customize your experience.</p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => pick('student')} className="px-6 py-2 bg-blue-600 text-white rounded">I'm a student</button>
          <button onClick={() => pick('tutor')} className="px-6 py-2 bg-green-600 text-white rounded">I'm a tutor</button>
        </div>
      </div>
    </main>
  )
}
