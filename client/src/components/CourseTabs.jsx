import React, { useState, useEffect } from 'react'
import showToast from '../utils/toast'

// ===== STUDENTS TAB =====
export function StudentsTab({ course }){
  const students = course.students || []
  
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-4">Enrolled Students ({students.length})</h3>
      
      {students.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-8">No students enrolled yet</div>
      ) : (
        <div className="space-y-3">
          {students.map((student, idx) => (
            <div key={student.studentId || idx} className="border rounded p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">Student ID: {student.studentId}</div>
                <div className="text-sm text-gray-600">
                  Enrolled: {new Date(student.enrolledAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                  View Profile
                </button>
                <button className="px-3 py-1 bg-gray-200 rounded text-sm">
                  Send Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ===== SETTINGS TAB =====
export function SettingsTab({ course, onUpdate }){
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: course.title || '',
    description: course.description || '',
    category: course.category || '',
    level: course.level || ''
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async ()=>{
    setSaving(true)
    try{
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`/api/courses/${course._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })
      if (res.ok){
        showToast('Course updated successfully', 'success')
        setEditing(false)
        if (onUpdate) onUpdate()
      } else {
        const data = await res.json()
        showToast(data.msg || 'Failed to update course', 'error')
      }
    } catch (err){
      console.error(err)
      showToast('Error updating course', 'error')
    }
    setSaving(false)
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Course Settings</h3>
        {!editing && (
          <button onClick={()=>setEditing(true)} className="px-3 py-1 bg-blue-600 text-white rounded">
            Edit Course
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Course Title</label>
            <input 
              type="text"
              value={formData.title}
              onChange={e=>setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              value={formData.description}
              onChange={e=>setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded h-24"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select 
                value={formData.category}
                onChange={e=>setFormData({...formData, category: e.target.value})}
                className="w-full p-2 border rounded"
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
              <label className="block text-sm font-medium mb-1">Level</label>
              <select 
                value={formData.level}
                onChange={e=>setFormData({...formData, level: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              onClick={()=>setEditing(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium text-gray-600">Title</div>
            <div className="text-lg">{course.title}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Description</div>
            <div>{course.description}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-600">Category</div>
              <div>{course.category || 'Not set'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Level</div>
              <div>{course.level || 'Not set'}</div>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Created</div>
            <div>{new Date(course.createdAt).toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== DISCUSSION TAB =====
export function DiscussionTab({ courseId }){
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const loadMessages = async ()=>{
    setLoading(true)
    try{
      const res = await fetch(`/api/courses/${courseId}/discussions`)
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (err){ console.error(err) }
    setLoading(false)
  }

  useEffect(()=>{ loadMessages() }, [courseId])

  const postMessage = async ()=>{
    if (!newMessage.trim()) return
    try{
      const res = await fetch(`/api/courses/${courseId}/discussions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage })
      })
      if (res.ok){
        setNewMessage('')
        loadMessages()
        showToast('Message posted', 'success')
      }
    } catch (err){ console.error(err); showToast('Failed to post', 'error') }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-4">Discussion Forum</h3>
      
      <div className="mb-4">
        <textarea 
          value={newMessage}
          onChange={e=>setNewMessage(e.target.value)}
          placeholder="Post a message to the class..."
          className="w-full p-3 border rounded h-24"
        />
        <button 
          onClick={postMessage}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Post Message
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading && <div className="text-center text-gray-500">Loading...</div>}
        {!loading && messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">No messages yet. Start the discussion!</div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className="border rounded p-3 bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-600">{msg.userId}</div>
                <div className="mt-1">{msg.message}</div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== ANALYTICS TAB =====
export function AnalyticsTab({ course, attendance, submissionsMap }){
  const totalStudents = course.students?.length || 0
  const totalAssignments = course.assignments?.length || 0
  const totalNotes = course.notes?.length || 0
  const totalAttendanceSessions = attendance.length
  
  // Calculate average attendance
  const avgAttendance = totalAttendanceSessions > 0 
    ? Math.round((attendance.reduce((sum, a) => sum + a.presentStudents.length, 0) / totalAttendanceSessions) / (totalStudents || 1) * 100)
    : 0

  // Calculate submission rate
  const totalSubmissions = Object.values(submissionsMap).reduce((sum, arr) => sum + arr.length, 0)
  const expectedSubmissions = totalStudents * totalAssignments
  const submissionRate = expectedSubmissions > 0 
    ? Math.round((totalSubmissions / expectedSubmissions) * 100)
    : 0

  // Calculate average grade
  const allSubmissions = Object.values(submissionsMap).flat()
  const gradedSubmissions = allSubmissions.filter(s => s.grade !== undefined)
  const avgGrade = gradedSubmissions.length > 0
    ? Math.round(gradedSubmissions.reduce((sum, s) => sum + s.grade, 0) / gradedSubmissions.length)
    : 0

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-4">Course Analytics</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="border rounded p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{totalStudents}</div>
          <div className="text-sm text-gray-600 mt-1">Total Students</div>
        </div>
        <div className="border rounded p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{avgAttendance}%</div>
          <div className="text-sm text-gray-600 mt-1">Avg Attendance</div>
        </div>
        <div className="border rounded p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">{submissionRate}%</div>
          <div className="text-sm text-gray-600 mt-1">Submission Rate</div>
        </div>
        <div className="border rounded p-4 text-center">
          <div className="text-3xl font-bold text-orange-600">{avgGrade}</div>
          <div className="text-sm text-gray-600 mt-1">Average Grade</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h4 className="font-semibold mb-3">Content Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Notes Uploaded:</span>
              <span className="font-medium">{totalNotes}</span>
            </div>
            <div className="flex justify-between">
              <span>Assignments Created:</span>
              <span className="font-medium">{totalAssignments}</span>
            </div>
            <div className="flex justify-between">
              <span>Attendance Sessions:</span>
              <span className="font-medium">{totalAttendanceSessions}</span>
            </div>
            <div className="flex justify-between">
              <span>Announcements:</span>
              <span className="font-medium">{course.announcements?.length || 0}</span>
            </div>
          </div>
        </div>

        <div className="border rounded p-4">
          <h4 className="font-semibold mb-3">Engagement Metrics</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Submissions:</span>
              <span className="font-medium">{totalSubmissions}</span>
            </div>
            <div className="flex justify-between">
              <span>Graded Submissions:</span>
              <span className="font-medium">{gradedSubmissions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Grading:</span>
              <span className="font-medium">{allSubmissions.length - gradedSubmissions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Discussion Posts:</span>
              <span className="font-medium">0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h4 className="font-semibold mb-2">Course Performance</h4>
        <div className="text-sm text-gray-700">
          {avgAttendance >= 80 && submissionRate >= 80 ? (
            <p>✅ Excellent! Your course has high engagement with strong attendance and submission rates.</p>
          ) : avgAttendance >= 60 && submissionRate >= 60 ? (
            <p>👍 Good performance. Consider sending reminders to improve attendance and submissions.</p>
          ) : (
            <p>⚠️ Low engagement detected. Try adding more interactive content or reaching out to students.</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ===== SYLLABUS TAB =====
export function SyllabusTab({ courseId, course, onUpdate }){
  const [syllabus, setSyllabus] = useState(course.syllabus || [])
  const [editing, setEditing] = useState(false)
  const [newModule, setNewModule] = useState({ title: '', description: '', topics: [] })
  const [newTopic, setNewTopic] = useState('')

  const addTopic = ()=>{
    if (!newTopic.trim()) return
    setNewModule({...newModule, topics: [...newModule.topics, newTopic]})
    setNewTopic('')
  }

  const addModule = ()=>{
    if (!newModule.title.trim()) return showToast('Module title required', 'error')
    setSyllabus([...syllabus, { ...newModule, id: Date.now() }])
    setNewModule({ title: '', description: '', topics: [] })
    showToast('Module added', 'success')
  }

  const removeModule = (id)=>{
    setSyllabus(syllabus.filter(m => m.id !== id))
  }

  const saveSyllabus = async ()=>{
    try{
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ syllabus })
      })
      if (res.ok){
        showToast('Syllabus saved', 'success')
        setEditing(false)
        if (onUpdate) onUpdate()
      } else {
        const data = await res.json()
        showToast(data.msg || 'Failed to save syllabus', 'error')
      }
    } catch (err){
      console.error(err)
      showToast('Failed to save syllabus', 'error')
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Course Syllabus</h3>
        <button 
          onClick={()=>setEditing(!editing)}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          {editing ? 'View Mode' : 'Edit Mode'}
        </button>
      </div>

      {editing && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h4 className="font-medium mb-3">Add New Module</h4>
          <div className="space-y-3">
            <input 
              type="text"
              placeholder="Module Title"
              value={newModule.title}
              onChange={e=>setNewModule({...newModule, title: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <textarea 
              placeholder="Module Description"
              value={newModule.description}
              onChange={e=>setNewModule({...newModule, description: e.target.value})}
              className="w-full p-2 border rounded h-20"
            />
            <div>
              <div className="flex gap-2 mb-2">
                <input 
                  type="text"
                  placeholder="Add topic"
                  value={newTopic}
                  onChange={e=>setNewTopic(e.target.value)}
                  className="flex-1 p-2 border rounded"
                  onKeyPress={e=>e.key==='Enter' && addTopic()}
                />
                <button onClick={addTopic} className="px-3 py-1 bg-gray-600 text-white rounded">
                  Add Topic
                </button>
              </div>
              {newModule.topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {newModule.topics.map((topic, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {topic}
                      <button 
                        onClick={()=>setNewModule({...newModule, topics: newModule.topics.filter((_, i) => i !== idx)})}
                        className="ml-2 text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button onClick={addModule} className="px-4 py-2 bg-green-600 text-white rounded">
              Add Module
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {syllabus.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No syllabus modules yet. {editing && 'Add your first module above!'}
          </div>
        ) : (
          syllabus.map((module, idx) => (
            <div key={module.id || idx} className="border rounded p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-lg">Module {idx + 1}: {module.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{module.description}</div>
                  {module.topics && module.topics.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium mb-1">Topics:</div>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {module.topics.map((topic, i) => (
                          <li key={i}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {editing && (
                  <button 
                    onClick={()=>removeModule(module.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {editing && syllabus.length > 0 && (
        <div className="mt-4 flex justify-end">
          <button onClick={saveSyllabus} className="px-4 py-2 bg-blue-600 text-white rounded">
            Save Syllabus
          </button>
        </div>
      )}
    </div>
  )
}
