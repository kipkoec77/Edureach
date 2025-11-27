import TutorSidebar from '../components/TutorSidebar'
import TutorNavbar from '../components/TutorNavbar'
import CourseCardTutor from '../components/CourseCardTutor'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

// fetch tutor courses from API

export default function MyCourses(){
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async ()=>{
    if (!user) return
    setLoading(true)
    try{
      console.log('Fetching courses for user:', user._id)
      const res = await fetch(`/api/courses?tutorId=${user._id}`)
      const data = await res.json()
      console.log('Courses fetched:', data)
      setCourses(data.courses || [])
    } catch (err){ 
      console.error('Error loading courses:', err) 
    } finally {
      setLoading(false)
    }
  }

  // Reload courses when user changes or when navigating to this page
  useEffect(()=>{ load() }, [user, location.pathname])

  const handleEdit = (c)=> alert('Edit '+c.title)
  const handleView = (c)=> navigate(`/tutor/course/${c._id}`)
  const handleDelete = async (c)=>{
    if (!confirm('Delete course?')) return
    try{
      const res = await fetch(`/api/courses/${c._id}`, { method: 'DELETE' })
      if (res.ok) load(); else alert('Delete failed')
    } catch (err){ console.error(err); alert('Error') }
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full px-6">
        <div className="md:col-span-1 w-full"><TutorSidebar/></div>
        <div className="md:col-span-3 space-y-6 w-full">
          <TutorNavbar/>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">My Courses</h2>
            <button onClick={()=>navigate('/tutor/courses/create')} className="px-4 py-2 bg-blue-600 text-white rounded">Create New Course</button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <p className="text-gray-600 mb-4">No courses yet. Create your first course!</p>
              <button onClick={()=>navigate('/tutor/courses/create')} className="px-4 py-2 bg-blue-600 text-white rounded">Create New Course</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {courses.map(c=> (
                <CourseCardTutor key={c._id} course={c} onEdit={()=>handleEdit(c)} onView={()=>handleView(c)} onDelete={()=>handleDelete(c)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
