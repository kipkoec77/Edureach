import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import TutorSidebar from '../components/TutorSidebar'
import TutorNavbar from '../components/TutorNavbar'
import API from '../services/api'
import showToast from '../utils/toast'

export default function CreateCourse(){
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState({ title:'', description:'', category:'', level:'Beginner' })
  const [loading, setLoading] = useState(false)

  // Reset form when component mounts
  useEffect(() => {
    setForm({ title:'', description:'', category:'', level:'Beginner' })
  }, [])

  const save = async ()=>{
    if (!form.title.trim()) {
      showToast('Course title is required', 'error')
      return
    }
    if (!form.description.trim()) {
      showToast('Course description is required', 'error')
      return
    }

    setLoading(true)
    try {
      const res = await API.post('/courses', {
        title: form.title,
        description: form.description,
        category: form.category || 'General',
        level: form.level
      })
      showToast('Course created successfully!', 'success')
      // Reset form
      setForm({ title:'', description:'', category:'', level:'Beginner' })
      // Navigate to courses page
      setTimeout(() => navigate('/tutor/courses'), 500)
    } catch (err) {
      console.error(err)
      showToast(err.response?.data?.msg || 'Failed to create course', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full px-6">
        <div className="md:col-span-1 w-full"><TutorSidebar/></div>
        <div className="md:col-span-3 space-y-6 w-full">
          <TutorNavbar/>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Create New Course</h2>
            <div className="flex gap-2">
              <button onClick={()=>navigate('/tutor/courses')} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
              <button onClick={save} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Course Title *</label>
              <input 
                value={form.title} 
                onChange={e=>setForm({...form, title:e.target.value})} 
                className="w-full border p-3 rounded" 
                placeholder="e.g., Introduction to Web Development" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Course Description *</label>
              <textarea 
                value={form.description} 
                onChange={e=>setForm({...form, description:e.target.value})} 
                className="w-full border p-3 rounded h-32" 
                placeholder="Describe what students will learn in this course..." 
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select 
                  value={form.category} 
                  onChange={e=>setForm({...form, category:e.target.value})} 
                  className="w-full border p-3 rounded"
                >
                  <option value="">Select Category</option>
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Business">Business</option>
                  <option value="Design">Design</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                <select 
                  value={form.level} 
                  onChange={e=>setForm({...form, level:e.target.value})} 
                  className="w-full border p-3 rounded"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> After creating the course, you can add notes, assignments, syllabus, and other content by clicking "View" on the course in "My Courses".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
