import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getStudentCourses, getStudentAssignments, getStudentNotes, getStudentAttendance, getStudentProgress } from '../services/api'
import StudentHeaderNav from '../components/StudentHeaderNav'
import CourseCard from '../components/CourseCard'
// Removed sidebar & shared nav for full-screen student dashboard
import AnnouncementCard from '../components/AnnouncementCard'
import AttendanceCard from '../components/AttendanceCard'

function StatCard({ label, value }){
  return (
    <div className="bg-white rounded-lg shadow p-4 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}

export default function DashboardStudent(){
  const { user } = useAuth()
  const navigate = useNavigate()
  const [enrolled, setEnrolled] = useState([])
  const [assignments, setAssignments] = useState([])
  const [notes, setNotes] = useState([])
  const [attendance, setAttendance] = useState([])
  const [progress, setProgress] = useState([])
  const [recent, setRecent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    if (!user) return
    setLoading(true)
    // fetch real student data
    Promise.all([
      getStudentCourses().then(data=>{
        const courses = data.courses || []
        setEnrolled(courses)
        if (courses.length) setRecent({ course: courses[0], lesson: 'Latest lesson' })
        return courses
      }),
      getStudentAssignments().then(data=>{
        setAssignments(data.assignments || [])
        return data.assignments || []
      }),
      getStudentNotes().then(data=>{
        setNotes(data.notes || [])
        return data.notes || []
      }),
      getStudentAttendance().then(data=>{
        setAttendance(data.attendance || [])
        return data.attendance || []
      }),
      getStudentProgress().then(data=>{
        setProgress(data.progress || [])
        return data.progress || []
      })
    ]).catch(err => {
      console.error('Failed to load dashboard data', err)
    }).finally(()=>{
      setLoading(false)
    })
  },[user])

  // Calculate stats
  const totalCompleted = progress.filter(p=> p.progress >= 100).length
  const totalAssignments = assignments.length
  const submittedAssignments = assignments.filter(a => a.submitted).length
  const pendingAssignments = assignments.filter(a => !a.submitted)
  const upcomingAssignments = assignments.filter(a => !a.submitted && a.dueDate && new Date(a.dueDate) > new Date()).sort((a,b)=> new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5)
  const overdueAssignments = assignments.filter(a => !a.submitted && a.dueDate && new Date(a.dueDate) < new Date())
  
  // Recent activities (last 7 days)
  const recentNotes = notes.filter(n => {
    const uploadDate = new Date(n.uploadedAt || n.createdAt)
    const daysAgo = (Date.now() - uploadDate) / (1000 * 60 * 60 * 24)
    return daysAgo <= 7
  }).slice(0, 5)
  
  const recentAnnouncements = enrolled.flatMap(c => 
    (c.announcements || []).map(a => ({...a, courseTitle: c.title, courseId: c._id}))
  ).filter(a => {
    const daysAgo = (Date.now() - new Date(a.createdAt)) / (1000 * 60 * 60 * 24)
    return daysAgo <= 7
  }).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  // Attendance percentage calculation
  const attendanceStats = enrolled.map(course => {
    const courseAttendance = attendance.filter(a => a.courseId === course._id)
    const present = courseAttendance.filter(a => a.wasPresent).length
    const total = courseAttendance.length
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0
    return { courseTitle: course.title, courseId: course._id, present, total, percentage }
  })

  // Auto-generated to-do list
  const todoList = [
    ...overdueAssignments.map(a => ({ 
      id: a._id, 
      type: 'overdue', 
      text: `OVERDUE: Submit "${a.title}" for ${a.courseTitle}`,
      priority: 'high'
    })),
    ...upcomingAssignments.slice(0, 3).map(a => ({
      id: a._id,
      type: 'assignment',
      text: `Submit "${a.title}" before ${new Date(a.dueDate).toLocaleDateString()}`,
      priority: new Date(a.dueDate) - Date.now() < 3 * 24 * 60 * 60 * 1000 ? 'medium' : 'low'
    })),
    ...recentNotes.map(n => ({
      id: n._id,
      type: 'note',
      text: `📚 New notes uploaded for ${n.courseTitle}`,
      priority: 'low'
    }))
  ].slice(0, 8)

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Loading your dashboard...</div>
          <div className="text-gray-500">Please wait</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 w-full">
      <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Top navigation (converted from sidebar links) */}
        <StudentHeaderNav />

        {/* Quick Actions Bar */}
        <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={()=>navigate('/student/browse')} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg">
                  <span>🔍</span> Browse All Courses
                </button>
                <button onClick={()=>document.getElementById('my-courses')?.scrollIntoView({behavior:'smooth'})} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                  <span>📚</span> My Courses
                </button>
                <button onClick={()=>navigate('/student/attendance')} className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition">
                  <span>✓</span> Attendance
                </button>
                <button onClick={()=>document.getElementById('assignments-section')?.scrollIntoView({behavior:'smooth'})} className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition">
                  <span>📝</span> Assignments {pendingAssignments.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingAssignments.length}</span>}
                </button>
                <button onClick={()=>document.getElementById('announcements-section')?.scrollIntoView({behavior:'smooth'})} className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition">
                  <span>📢</span> Announcements {recentAnnouncements.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{recentAnnouncements.length}</span>}
                </button>
                <button onClick={()=>document.getElementById('notes-section')?.scrollIntoView({behavior:'smooth'})} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition">
                  <span>📄</span> Notes
                </button>
              </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow text-center hover:shadow-lg transition">
                <div className="text-3xl font-bold text-blue-600">{enrolled.length}</div>
                <div className="text-sm text-gray-600 mt-1">Enrolled Courses</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center hover:shadow-lg transition">
                <div className="text-3xl font-bold text-green-600">{submittedAssignments}/{totalAssignments}</div>
                <div className="text-sm text-gray-600 mt-1">Assignments Done</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center hover:shadow-lg transition">
                <div className="text-3xl font-bold text-purple-600">{totalCompleted}</div>
                <div className="text-sm text-gray-600 mt-1">Completed Courses</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center hover:shadow-lg transition">
                <div className="text-3xl font-bold text-red-600">{overdueAssignments.length}</div>
                <div className="text-sm text-gray-600 mt-1">Overdue Items</div>
              </div>
          </div>

          {/* Two-column layout: To-Do + Recent Activity */}
          <div className="grid md:grid-cols-2 gap-6">
              {/* Personalized To-Do List */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span>✓</span> Your To-Do List
                </h2>
                <ul className="space-y-2">
                  {todoList.length === 0 && (
                    <li className="text-gray-500 text-sm">🎉 All caught up! No pending tasks.</li>
                  )}
                  {todoList.map(todo => (
                    <li key={todo.id} className={`p-3 rounded border-l-4 ${
                      todo.priority === 'high' ? 'border-red-500 bg-red-50' :
                      todo.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="text-sm">{todo.text}</div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent Activities Widget */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span>🔔</span> Recent Activity
                </h2>
                <div className="space-y-3">
                  {recentAnnouncements.length === 0 && recentNotes.length === 0 && (
                    <div className="text-gray-500 text-sm">No recent activity</div>
                  )}
                  {recentAnnouncements.map(ann => (
                    <div key={ann._id} className="flex items-start gap-3 p-2 border-b">
                      <span className="text-2xl">📢</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{ann.title}</div>
                        <div className="text-xs text-gray-500">{ann.courseTitle} • {new Date(ann.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                  {recentNotes.map(note => (
                    <div key={note._id} className="flex items-start gap-3 p-2 border-b">
                      <span className="text-2xl">📚</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">New notes uploaded</div>
                        <div className="text-xs text-gray-500">{note.courseTitle} • {new Date(note.uploadedAt || note.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          </div>

          {/* Course Overview Cards */}
          <div id="my-courses" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <span>📚</span> My Courses
              </h2>
              {enrolled.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">You haven't enrolled in any courses yet</div>
                  <Link to="/courses" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Browse Courses
                  </Link>
                </div>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolled.map(course=> {
                  const courseProgress = progress.find(p => p.courseId === course._id)
                  const courseAttendance = attendanceStats.find(a => a.courseId === course._id)
                  const nextAssignment = upcomingAssignments.find(a => a.courseId === course._id)
                  
                  return (
                    <div key={course._id} className="border rounded-lg overflow-hidden hover:shadow-xl transition">
                      {/* Course Header */}
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                        <h3 className="font-bold text-lg">{course.title}</h3>
                        <p className="text-sm text-blue-100 mt-1">
                          {course.category || 'General'} • {course.level || 'All Levels'}
                        </p>
                      </div>
                      
                      {/* Course Stats */}
                      <div className="p-4 space-y-3">
                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold">{courseProgress?.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full transition-all" style={{width: `${courseProgress?.progress || 0}%`}} />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {courseProgress?.submitted || 0}/{courseProgress?.total || 0} assignments completed
                          </div>
                        </div>

                        {/* Attendance */}
                        {courseAttendance && courseAttendance.total > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Attendance</span>
                            <span className={`font-semibold ${courseAttendance.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                              {courseAttendance.percentage}%
                            </span>
                          </div>
                        )}

                        {/* Next Task Due */}
                        {nextAssignment && (
                          <div className="text-xs bg-yellow-50 border border-yellow-200 rounded p-2">
                            <div className="font-medium text-yellow-800">Next due:</div>
                            <div className="text-yellow-700">{nextAssignment.title}</div>
                            <div className="text-yellow-600">{new Date(nextAssignment.dueDate).toLocaleDateString()}</div>
                          </div>
                        )}

                        {/* Continue Learning Button */}
                        <Link 
                          to={`/courses/${course._id}/learn`}
                          className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                          Continue Learning →
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
          </div>

          {/* Upcoming Assignments Timeline */}
          <div id="assignments-section" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span>📝</span> Upcoming Assignments
              </h2>
              {upcomingAssignments.length === 0 && (
                <div className="text-gray-500">No upcoming assignments</div>
              )}
              <div className="space-y-3">
                {upcomingAssignments.map(a => {
                  const daysUntilDue = Math.ceil((new Date(a.dueDate) - Date.now()) / (1000 * 60 * 60 * 24))
                  const isUrgent = daysUntilDue <= 3
                  
                  return (
                    <div key={a._id} className={`flex items-start gap-4 p-4 rounded-lg border-l-4 ${
                      isUrgent ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex-shrink-0 w-16 text-center">
                        <div className={`text-2xl font-bold ${isUrgent ? 'text-red-600' : 'text-blue-600'}`}>
                          {daysUntilDue}
                        </div>
                        <div className="text-xs text-gray-600">days left</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{a.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{a.description || 'No description'}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-blue-600">{a.courseTitle}</span>
                          <span className="text-gray-500">Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button 
                        onClick={()=>navigate(`/courses/${a.courseId}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        View
                      </button>
                    </div>
                  )
                })}
              </div>
          </div>

          {/* Attendance Calendar Widget */}
          <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span>✓</span> Attendance Overview
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendanceStats.length === 0 && (
                  <div className="text-gray-500">No attendance records yet</div>
                )}
                {attendanceStats.map(stat => (
                  <div key={stat.courseId} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{stat.courseTitle}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Attendance Rate</span>
                      <span className={`font-bold text-lg ${
                        stat.percentage >= 75 ? 'text-green-600' :
                        stat.percentage >= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {stat.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className={`h-2 rounded-full ${
                        stat.percentage >= 75 ? 'bg-green-500' :
                        stat.percentage >= 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} style={{width: `${stat.percentage}%`}} />
                    </div>
                    <div className="text-xs text-gray-500">
                      {stat.present} present / {stat.total} total sessions
                    </div>
                    {stat.percentage < 75 && (
                      <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                        ⚠️ Attendance below 75%
                      </div>
                    )}
                  </div>
                ))}
              </div>
          </div>

          {/* Announcements Section */}
          <div id="announcements-section" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span>📢</span> Recent Announcements
              </h2>
              {recentAnnouncements.length === 0 && (
                <div className="text-gray-500">No recent announcements</div>
              )}
              <div className="space-y-3">
                {recentAnnouncements.map(ann => (
                  <div key={`${ann.courseId}-${ann._id}`} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{ann.title}</h3>
                        <p className="text-sm text-gray-700 mt-2">{ann.message}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{ann.courseTitle}</span>
                          <span>{new Date(ann.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          </div>

          {/* Notes & Resources Section */}
          <div id="notes-section" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span>📄</span> Recent Notes & Resources
              </h2>
              {recentNotes.length === 0 && (
                <div className="text-gray-500">No recent notes uploaded</div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                {recentNotes.map(note => (
                  <div key={note._id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">📄</div>
                      <div className="flex-1">
                        <h3 className="font-medium">{note.originalName || note.filename}</h3>
                        <div className="text-sm text-gray-600 mt-1">{note.courseTitle}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Uploaded {new Date(note.uploadedAt || note.createdAt).toLocaleDateString()}
                        </div>
                        <a 
                          href={note.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-block mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Download PDF
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          </div>

        {/* Course Progress Details */}
        {progress.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <span>📊</span> Detailed Course Progress
                </h2>
                <div className="space-y-4">
                  {progress.map(p => (
                    <div key={p.courseId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{p.courseTitle}</h3>
                        <span className="text-lg font-bold text-blue-600">{p.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{p.submitted}/{p.total} assignments submitted</span>
                        <Link to={`/courses/${p.courseId}`} className="text-blue-600 hover:underline">
                          View Course →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
          </div>
        )}
      </div>
    </main>
  )
}
