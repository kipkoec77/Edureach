import React, {useState} from 'react'
import API from '../services/api'

export default function TutorApplication(){
  const [form, setForm] = useState({subjects:'', experience:'', idNumber:'', certificateFile: null})
  const [status, setStatus] = useState(null)

  const submit = async (e)=>{
    e.preventDefault();
    try {
      // convert file to base64 to send as certificateURL (simple workaround)
      let certificateURL = ''
      if (form.certificateFile) {
        const file = form.certificateFile
        certificateURL = await new Promise((res, rej)=>{
          const reader = new FileReader()
          reader.onload = ()=>res(reader.result)
          reader.onerror = rej
          reader.readAsDataURL(file)
        })
      }

      const subjects = form.subjects.split(',').map(s=>s.trim())
      await API.post('/tutors/apply', { subjects, experience: form.experience, idNumber: form.idNumber, certificateURL })
      setStatus('Application submitted — awaiting review')
    } catch (err) {
      console.error(err)
      setStatus('Error submitting application')
    }
  }
  return (
    <main className="min-h-screen w-full bg-gray-50 flex items-center">
      <div className="p-8 w-full px-6">
        <div className="bg-white p-6 rounded shadow max-w-2xl w-full mx-auto">
        <h2 className="text-2xl">Tutor Application</h2>
        <p className="text-sm text-gray-600 mt-2">Provide your details to apply as a tutor. Upload a certificate (PDF/image).</p>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm">Full name</label>
            <input className="w-full border p-2 rounded" value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} />
          </div>
          <div>
            <label className="block text-sm">ID Number</label>
            <input className="w-full border p-2 rounded" value={form.idNumber} onChange={e=>setForm({...form, idNumber:e.target.value})} />
          </div>
          <div>
            <label className="block text-sm">Subjects (comma separated)</label>
            <input className="w-full border p-2 rounded" value={form.subjects} onChange={e=>setForm({...form, subjects:e.target.value})} />
          </div>
          <div>
            <label className="block text-sm">Experience (short)</label>
            <textarea className="w-full border p-2 rounded" value={form.experience} onChange={e=>setForm({...form, experience:e.target.value})} />
          </div>
          <div>
            <label className="block text-sm">Certificate (PDF or image)</label>
            <input type="file" accept="image/*,.pdf" onChange={e=>setForm({...form, certificateFile: e.target.files[0]})} />
          </div>
          <div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Submit Application</button>
          </div>
          {status && <div className="text-sm text-green-600">{status}</div>}
        </form>
      </div>
    </div>
    </main>
  )
}
