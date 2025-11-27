import React from 'react'
import { useNavigate } from 'react-router-dom'
import SignupForm from '../components/SignupForm'

export default function Register(){
  const navigate = useNavigate()

  const onSuccess = (user) =>{
    if(!user) return
    if (user.role === 'admin') navigate('/admin')
    else if (user.role === 'tutor') navigate('/tutor')
    else navigate('/student')
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-white">Create your account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <SignupForm onSuccess={onSuccess} />
        <p className="mt-6 text-center text-sm text-gray-500">Already have an account? <a href="/login" className="font-semibold text-primary hover:text-primary-dark">Sign in</a></p>
      </div>
    </div>
  )
}
