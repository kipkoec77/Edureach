import React, { useEffect, useState } from 'react'
import TutorSidebar from '../components/TutorSidebar'
import TutorNavbar from '../components/TutorNavbar'
import ProgressBar from '../components/ProgressBar'
import { useAuth } from '../context/AuthContext'

// Aggregate students from attendance records across tutor courses
export default function Students(){
  const { user } = useAuth()
  const [students, setStudents] = useState([])

  const load = async ()=>{
    if (!user) return
    try{
      const res = await fetch(`/api/courses?tutorId=${user._id}`)
      const data = await res.json()
      const courses = data.courses || []
      const map = new Map()
      courses.forEach(c=>{
        (c.attendance||[]).forEach(a=>{
          if (!map.has(a.studentId)) map.set(a.studentId, { studentId: a.studentId, lastSeen: a.date, courses: new Set([c.title]) })
          else { const s = map.get(a.studentId); s.courses.add(c.title); if (new Date(a.date) > new Date(s.lastSeen)) s.lastSeen = a.date }
        })
      })
      const list = Array.from(map.values()).map(v=>({ id: v.studentId, name: v.studentId, course: Array.from(v.courses).join(', '), lastActive: v.lastSeen, progress: 0 }))
      setStudents(list)
    } catch (err){ console.error(err) }
  }

  useEffect(()=>{ load() }, [user])

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full px-6">
        <div className="md:col-span-1 w-full"><TutorSidebar/></div>
        <div className="md:col-span-3 space-y-6 w-full">
          <TutorNavbar/>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Students</h2>
            <div className="text-sm text-gray-500">Total: {students.length}</div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <table className="w-full text-sm">
              <thead className="text-gray-500 text-left">
                <tr><th>Name</th><th>Course(s)</th><th>Progress</th><th>Last active</th></tr>
              </thead>
              <tbody>
                {students.map(s=> (
                  <tr key={s.id} className="border-t">
                    <td className="py-3">{s.name}</td>
                    <td>{s.course}</td>
                    <td className="w-64"><ProgressBar value={s.progress} /></td>
                    <td className="text-gray-500">{s.lastActive ? new Date(s.lastActive).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
