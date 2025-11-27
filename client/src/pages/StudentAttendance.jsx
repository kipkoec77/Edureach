import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getStudentCourses, getCourseAttendance, markAttendance } from '../services/api'
import StudentHeaderNav from '../components/StudentHeaderNav'
import showToast from '../utils/toast'

export default function StudentAttendance(){
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    if (!user) return
    getStudentCourses().then(data=>{
      const coursesData = data.courses || []
      setCourses(coursesData)
      if (coursesData.length > 0) setSelectedCourse(coursesData[0]._id)
    }).catch(err => console.error('Failed to load courses', err))
  },[user])

  useEffect(()=>{
    if (!selectedCourse) return
    loadAttendance()
  },[selectedCourse])

  const loadAttendance = async ()=>{
    setLoading(true)
    try{
      const data = await getCourseAttendance(selectedCourse)
      setAttendanceRecords(data.records || [])
    } catch (err){ 
      console.error('Failed to load attendance', err) 
    }
    setLoading(false)
  }

  const handleMarkPresent = async (attendanceId)=>{
    try{
      const data = await markAttendance(attendanceId)
      if (data.success) {
        showToast('Marked present successfully', 'success')
        loadAttendance()
      }
    } catch (err){
      const msg = err?.response?.data?.msg || 'Failed to mark attendance'
      showToast(msg, 'error')
    }
  }

  const selectedCourseData = courses.find(c => c._id === selectedCourse)
  const myUserId = user?.id

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-6 space-y-6">
        <StudentHeaderNav />
        <div>
          <h1 className="text-3xl font-bold mb-6">My Attendance</h1>

        {/* Course Selector */}
        {courses.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <label className="block text-sm font-medium mb-2">Select Course:</label>
            <select 
              value={selectedCourse || ''} 
              onChange={e => setSelectedCourse(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}

        {/* Attendance Records */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-4">
            {attendanceRecords.length === 0 && (
              <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                No attendance sessions for this course yet
              </div>
            )}
            {attendanceRecords.map(record => {
              const isPresent = record.presentStudents.includes(myUserId)
              const isOpen = record.status === 'open'
              
              return (
                <div key={record._id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedCourseData?.title}</h3>
                      <div className="text-sm text-gray-600">
                        {new Date(record.date).toLocaleString()}
                      </div>
                      <div className="text-sm mt-1">
                        {record.presentStudents.length} / {record.totalEnrolled} students marked present
                      </div>
                    </div>
                    <div className="text-right">
                      {isPresent ? (
                        <div className="px-4 py-2 bg-green-100 text-green-800 rounded font-medium">
                          ✓ Present
                        </div>
                      ) : isOpen ? (
                        <button 
                          onClick={() => handleMarkPresent(record._id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Mark Present
                        </button>
                      ) : (
                        <div className="px-4 py-2 bg-red-100 text-red-800 rounded">
                          Absent
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Status: {isOpen ? '🟢 Open for marking' : '🔴 Closed'}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
