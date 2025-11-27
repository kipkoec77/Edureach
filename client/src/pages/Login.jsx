import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

export default function Login(){
  const navigate = useNavigate()

  const onSuccess = () =>{
    // Firebase auth will handle redirect after profile loads
    navigate('/student')
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-white">Sign in to your account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm onSuccess={onSuccess} />
        <p className="mt-6 text-center text-sm text-gray-500">
          Not a member? <a href="/register" className="font-semibold text-primary hover:text-primary-dark">Create an account</a>
        </p>
      </div>
    </div>
  )
}
