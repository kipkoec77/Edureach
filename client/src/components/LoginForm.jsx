import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginForm({ onSuccess }){
  const { login } = useAuth()
  const [form, setForm] = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    setError('')
    try{
      await login({ email: form.email, password: form.password })
      if(onSuccess) onSuccess()
    }catch(err){
      setError(err.response?.data?.msg || err.message || 'Login failed')
    }finally{ setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="max-w-md w-full bg-white p-6 rounded-2xl shadow-card-md">
      <h3 className="text-xl font-semibold mb-4">Sign in</h3>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      <label className="block text-sm text-text-muted">Email</label>
      <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="form-input w-full mt-2 px-4" placeholder="you@example.com" required />
      <label className="block text-sm text-text-muted mt-4">Password</label>
      <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="form-input w-full mt-2 px-4" placeholder="••••••••" required />
      <div className="mt-6 flex items-center justify-between">
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        <a href="#" className="text-sm text-text-muted hover:text-text-main">Forgot?</a>
      </div>
    </form>
  )
}
