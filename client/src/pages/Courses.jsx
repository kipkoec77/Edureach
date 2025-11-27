import React, {useEffect, useState} from 'react'
import { useAuth } from '../context/AuthContext'
import { getEnrolledCourses, enrollCourse } from '../services/api'
import CourseCard from '../components/CourseCard'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Courses(){
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [enrolledIds, setEnrolledIds] = useState(new Set())
  const nav = useNavigate()

  useEffect(()=>{
    API.get('/courses').then(r=>setCourses(r.data)).catch(console.error)
  },[])

  useEffect(()=>{
    if (!user) return
    getEnrolledCourses(user._id).then(list=>{
      const s = new Set((list||[]).map(c=>String(c._id)))
      setEnrolledIds(s)
    }).catch(()=>{})
  },[user])

  const handleEnroll = async (courseId)=>{
    try{
      await enrollCourse(courseId)
      // navigate to student dashboard which will show enrolled courses
      nav('/student')
    } catch (err){
      console.error('Enroll failed', err)
      alert('Failed to enroll')
    }
  }

  return (
    <main className="min-h-screen w-full bg-gray-50">
      <div className="w-full px-4 py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">All Courses</h2>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(c=> (
            <div key={c._id}>
              <CourseCard course={c} />
              <div className="mt-2 flex justify-end">
                {enrolledIds.has(String(c._id)) ? (
                  <button onClick={()=>nav(`/courses/${c._id}`)} className="px-3 py-1 bg-blue-600 text-white rounded">Open</button>
                ) : (
                  <button onClick={()=>handleEnroll(c._id)} className="px-3 py-1 bg-green-600 text-white rounded">Enroll</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
