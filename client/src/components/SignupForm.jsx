import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function SignupForm({ onSuccess }){
  const { signup } = useAuth()
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    setError('')
    try{
      await signup({ name: form.name, email: form.email, password: form.password })
      if(onSuccess) onSuccess()
    }catch(err){
      setError(err.response?.data?.msg || err.message || 'Signup failed')
    }finally{ setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="max-w-md w-full bg-white p-6 rounded-2xl shadow-card-md">
      <h3 className="text-xl font-semibold mb-4">Create account</h3>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      <label className="block text-sm text-text-muted">Full name</label>
      <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="form-input w-full mt-2 px-4" placeholder="Your name" required />
      <label className="block text-sm text-text-muted mt-4">Email</label>
      <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="form-input w-full mt-2 px-4" placeholder="you@example.com" required />
      <label className="block text-sm text-text-muted mt-4">Password</label>
      <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="form-input w-full mt-2 px-4" placeholder="Choose a password" required minLength="6" />
      <div className="mt-6">
        <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
      </div>
    </form>
  )
}
