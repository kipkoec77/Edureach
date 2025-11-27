import React, { useEffect, useState } from 'react'
import API from '../services/api'
import DashboardNavBar from '../components/DashboardNavBar'

export default function DashboardAdmin(){
  const [apps, setApps] = useState([])

  useEffect(()=>{
    API.get('/tutors/pending').then(r=>setApps(r.data)).catch(()=>{})
  },[])

  const update = async (id, status) => {
    try{
      await API.patch(`/tutors/approve/${id}`, { status })
      setApps(prev => prev.filter(a=>a._id !== id))
    } catch (err){
      alert('Error updating application')
    }
  }

  return (
    <main className="min-h-screen w-full bg-gray-50">
      <DashboardNavBar />
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <header className="relative bg-white shadow-sm rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 mt-2">Pending tutor applications</p>
      </header>
      <div className="bg-white rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left">
              <th className="p-3">Name</th>
              <th>Subjects</th>
              <th>ID</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(a=> (
              <tr key={a._id} className="border-t">
                <td className="p-3">{a.userId?.name}</td>
                <td>{(a.subjects||[]).join(', ')}</td>
                <td>{a.idNumber}</td>
                <td className="p-3 space-x-2">
                  <button onClick={()=>update(a._id,'approved')} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                  <button onClick={()=>update(a._id,'rejected')} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </main>
  )
}
