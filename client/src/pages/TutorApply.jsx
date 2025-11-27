import React, { useState } from 'react'
import API from '../utils/api'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function TutorApply(){
  const [form, setForm] = useState({ fullName: '', idNumber: '', subjects: '', experience: '', certificateURL: '' })
  const [status, setStatus] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    try {
      const payload = { subjects: form.subjects.split(',').map(s=>s.trim()), experience: form.experience, idNumber: form.idNumber, certificateURL: form.certificateURL }
      await API.post('/tutors/apply', payload)
      setStatus('Application submitted — awaiting review')
    } catch (err) {
      setStatus('Error submitting application')
      console.error(err)
    }
  }

  return (
    <main className="min-h-screen w-full bg-gray-50">
      <div className="w-full px-4 py-8 max-w-2xl">
        <h2 className="text-2xl font-semibold">Become a Tutor</h2>
        <p className="mt-2 text-sm text-gray-600">Fill in your details and upload a certificate (paste a URL for now).</p>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <Input placeholder="Full name" value={form.fullName} onChange={e=>setForm({...form, fullName: e.target.value})} />
        <Input placeholder="ID number" value={form.idNumber} onChange={e=>setForm({...form, idNumber: e.target.value})} />
        <Input placeholder="Subjects (comma separated)" value={form.subjects} onChange={e=>setForm({...form, subjects: e.target.value})} />
        <Input placeholder="Experience (short)" value={form.experience} onChange={e=>setForm({...form, experience: e.target.value})} />
        <Input placeholder="Certificate URL" value={form.certificateURL} onChange={e=>setForm({...form, certificateURL: e.target.value})} />
        <div>
          <Button type="submit">Apply</Button>
        </div>
        {status && <div className="text-sm text-green-600">{status}</div>}
      </form>
      </div>
    </main>
  )
}
