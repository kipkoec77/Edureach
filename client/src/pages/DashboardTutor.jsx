import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TutorSidebar from '../components/TutorSidebar'
import DashboardNavBar from '../components/DashboardNavBar'
import StatsCard from '../components/StatsCard'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'

export default function DashboardTutor(){
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const loadCourses = async ()=>{
    if (!user) return
    setLoading(true)
    try{
      const res = await API.get(`/courses?tutorId=${user._id}`)
      setCourses(res.data.courses || [])
    } catch (err){
      console.error('Failed to load courses', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ loadCourses() }, [user])

  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({ title:'', description:'', category:'', level:'' })

  const startEdit = (c)=>{
    setEditing(c)
    setEditForm({ title:c.title||'', description:c.description||'', category:c.category||'', level:c.level||'' })
  }

  const submitEdit = async ()=>{
    try{
      await API.put(`/courses/${editing._id}`, editForm)
      setEditing(null)
      loadCourses()
      alert('Course updated successfully!')
    } catch (err){ 
      console.error(err)
      alert(err.response?.data?.msg || 'Failed to update')
    }
  }

  const deleteCourse = async (id)=>{
    if (!confirm('Delete this course? This action cannot be undone.')) return
    try{
      await API.delete(`/courses/${id}`)
      loadCourses()
      alert('Course deleted successfully!')
    } catch (err){ 
      console.error(err)
      alert(err.response?.data?.msg || 'Error deleting course')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full px-6">
        <div className="md:col-span-1 w-full">
          <TutorSidebar />
        </div>
        <div className="md:col-span-3 space-y-6 w-full">
          <DashboardNavBar />

          <header className="relative bg-white shadow-sm rounded-lg p-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tutor Dashboard</h1>
            <p className="text-sm text-gray-600 mt-2">Manage your courses and students.</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard label="Total Courses" value={courses.length} />
            <StatsCard label="Active Classes" value={3} />
            <StatsCard label="Total Students" value={0} />
            <StatsCard label="Pending Reviews" value={0} />
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-3">My Courses</h3>
            {loading && (
              <p className="text-gray-500 text-center py-4">Loading courses...</p>
            )}
            {!loading && courses.length === 0 && (
              <p className="text-gray-500 text-center py-4">No courses yet. Create your first course above!</p>
            )}
            <ul className="space-y-2">
              {courses.map((c) => (
                <li key={c._id} className="p-3 border rounded hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-lg">{c.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                      <p className="text-xs text-gray-500 mt-2">{c.category || 'General'} • {c.level || 'All Levels'}</p>
                      <p className="text-xs text-gray-400">Created: {new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>startEdit(c)} className="px-3 py-1 bg-yellow-400 rounded text-sm hover:bg-yellow-500">Edit</button>
                      <button onClick={()=>deleteCourse(c._id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">Delete</button>
                      <Link to={`/tutor/course/${c._id}`} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Manage</Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Edit Modal */}
          {editing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h3 className="text-xl font-semibold mb-4">Edit Course</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input 
                      type="text" 
                      value={editForm.title} 
                      onChange={e=>setEditForm({...editForm, title:e.target.value})}
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                      value={editForm.description} 
                      onChange={e=>setEditForm({...editForm, description:e.target.value})}
                      className="w-full border rounded p-2 h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input 
                      type="text" 
                      value={editForm.category} 
                      onChange={e=>setEditForm({...editForm, category:e.target.value})}
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Level</label>
                    <input 
                      type="text" 
                      value={editForm.level} 
                      onChange={e=>setEditForm({...editForm, level:e.target.value})}
                      className="w-full border rounded p-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={()=>setEditing(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                  <button onClick={submitEdit} className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}


