import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API, { getEnrolledCourses, submitAssignment, getMySubmission } from '../services/api'
import ProgressBar from '../components/ProgressBar'
import showToast from '../utils/toast'

export default function CourseDetails(){
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [enrolled, setEnrolled] = useState(false)
  const [tab, setTab] = useState('overview')
  const [uploading, setUploading] = useState(false)
  const [mySubmissions, setMySubmissions] = useState({})

  const loadCourse = async ()=>{
    try{
      const res = await API.get(`/courses/${id}`)
      setCourse(res.data.course || res.data)
    } catch (err){ console.error(err) }
  }

  const loadLessons = async ()=>{
    try{
      const res = await API.get(`/lessons/${id}`)
      setLessons(res.data || [])
    } catch (err){ /* ignore */ }
  }

  useEffect(()=>{
    loadCourse(); loadLessons()
  },[id])

  // check enrollment for the current user
  useEffect(()=>{
    if (!user) return
    (async ()=>{
      try{
        const courses = await getEnrolledCourses(user._id)
        const found = (courses||[]).some(c=> String(c._id) === String(id))
        setEnrolled(found)
      } catch (err){ console.error(err) }
    })()
  },[user, id])

  // load current student's submissions for assignments
  useEffect(()=>{
    if (!user || !enrolled) return
    (async ()=>{
      try{
        const map = {};
        for (const a of (course.assignments || [])){
          try{
            const res = await getMySubmission(id, a._id || a.filename || a.id);
            if (res && res.submission) map[a._id || a.filename || a.id] = res.submission;
          } catch(e){ /* ignore per-assignment errors */ }
        }
        setMySubmissions(map);
      } catch (err){ console.error(err) }
    })()
  },[user, enrolled, course.assignments, id])

  if (!course) return <div className="p-8">Loading...</div>

  return (
    <main className="min-h-screen w-full bg-gray-50">
      <div className="w-full px-6 py-8">
        <div className="bg-white rounded-lg shadow p-6 w-full">
          <div className="flex items-center gap-6">
            <div className="w-36 h-24 bg-gray-200 rounded overflow-hidden">
              {course.thumbnailURL && <img src={course.thumbnailURL} alt="thumb" className="w-full h-full object-cover" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-sm text-gray-600">{course.subject} • by {course.tutorId?.name}</p>
              <p className="mt-3 text-gray-700">{course.description}</p>
              <div className="mt-4">
                {!enrolled ? (
                  <button onClick={()=>nav('/student')} className="px-4 py-2 bg-blue-600 text-white rounded-md">Back to Dashboard</button>
                ) : (
                  <button onClick={()=>setTab('materials')} className="px-4 py-2 bg-blue-600 text-white rounded-md">Open Course</button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs - available when enrolled */}
          <div className="mt-6">
            <div className="flex gap-2 border-b pb-2">
              <button onClick={()=>setTab('overview')} className={`px-3 py-1 ${tab==='overview'?'border-b-2 border-blue-600':''}`}>Overview</button>
              <button onClick={()=>setTab('materials')} className={`px-3 py-1 ${tab==='materials'?'border-b-2 border-blue-600':''}`}>Materials</button>
              <button onClick={()=>setTab('assignments')} className={`px-3 py-1 ${tab==='assignments'?'border-b-2 border-blue-600':''}`}>Assignments</button>
              <button onClick={()=>setTab('announcements')} className={`px-3 py-1 ${tab==='announcements'?'border-b-2 border-blue-600':''}`}>Announcements</button>
              <button onClick={()=>setTab('attendance')} className={`px-3 py-1 ${tab==='attendance'?'border-b-2 border-blue-600':''}`}>Attendance</button>
              <button onClick={()=>setTab('discussions')} className={`px-3 py-1 ${tab==='discussions'?'border-b-2 border-blue-600':''}`}>Discussions</button>
              <button onClick={()=>setTab('syllabus')} className={`px-3 py-1 ${tab==='syllabus'?'border-b-2 border-blue-600':''}`}>Syllabus</button>
            </div>

            <div className="mt-4 space-y-4">
              {tab==='overview' && (
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded border">
                    <h3 className="font-semibold mb-2">Course Details</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><span className="font-medium">Title:</span> {course.title}</div>
                      <div><span className="font-medium">Category:</span> {course.category || 'General'}</div>
                      <div><span className="font-medium">Level:</span> {course.level || 'All Levels'}</div>
                      <div><span className="font-medium">Created:</span> {new Date(course.createdAt).toLocaleDateString()}</div>
                      <div className="pt-2"><span className="font-medium">Description:</span> <span className="text-gray-700">{course.description || 'No description provided.'}</span></div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h3 className="font-semibold mb-2">Lessons</h3>
                    <ul className="space-y-2">
                      {lessons.map(l=> (
                        <li key={l._id} className="p-3 border rounded flex items-center justify-between">
                          <div>
                            <div className="font-medium">{l.title}</div>
                            <div className="text-sm text-gray-500">{new Date(l.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div className="w-48">
                            <ProgressBar percent={Math.floor(Math.random()*100)} />
                          </div>
                        </li>
                      ))}
                      {lessons.length === 0 && <li className="text-sm text-gray-500">No lessons available</li>}
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h3 className="font-semibold mb-2">Quick Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="p-2 rounded bg-blue-50 text-blue-700">Notes: {(course.notes||[]).length}</div>
                      <div className="p-2 rounded bg-purple-50 text-purple-700">Assignments: {(course.assignments||[]).length}</div>
                      <div className="p-2 rounded bg-green-50 text-green-700">Announcements: {(course.announcements||[]).length}</div>
                      <div className="p-2 rounded bg-yellow-50 text-yellow-700">Syllabus Modules: {(course.syllabus||[]).length}</div>
                    </div>
                  </div>
                </div>
              )}
              {tab==='syllabus' && (
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold mb-3">Syllabus</h3>
                  {!(course.syllabus||[]).length && (
                    <div className="text-sm text-gray-500">No syllabus added yet</div>
                  )}
                  <div className="space-y-4">
                    {(course.syllabus||[]).map((m, idx) => (
                      <div key={idx} className="border rounded p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-lg">{m.title}</div>
                            {m.description && <div className="text-sm text-gray-600 mt-1">{m.description}</div>}
                          </div>
                          <div className="text-xs text-gray-500">Module {idx+1}</div>
                        </div>
                        {m.topics?.length ? (
                          <ul className="mt-3 space-y-1 list-disc list-inside text-sm text-gray-700">
                            {m.topics.map((t,i)=> <li key={i}>{t}</li>)}
                          </ul>
                        ) : (
                          <div className="mt-3 text-xs text-gray-500">No topics listed</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab==='materials' && (
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold mb-2">Materials</h3>
                  <ul className="space-y-2">
                    {(course.notes||[]).map(n=> (
                      <li key={n._id}><a className="text-blue-600 underline" href={n.url} target="_blank" rel="noreferrer">{n.originalName}</a></li>
                    ))}
                    {(!(course.notes||[]).length) && <div className="text-sm text-gray-500">No materials yet</div>}
                  </ul>
                </div>
              )}

              {tab==='assignments' && (
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold mb-2">Assignments</h3>
                  <ul className="space-y-4">
                    {(course.assignments||[]).map(a=> {
                      const dueDate = a.dueDate ? new Date(a.dueDate) : null
                      const isOverdue = dueDate && dueDate < new Date()
                      return (
                        <li key={a._id || a.filename || a.id} className="p-4 border rounded">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-semibold text-lg">{a.title || a.originalName}</div>
                              {a.description && <div className="text-sm text-gray-600 mt-1">{a.description}</div>}
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>Posted: {new Date(a.uploadedAt||a.createdAt||Date.now()).toLocaleDateString()}</span>
                                {dueDate && (
                                  <span className={isOverdue ? 'text-red-600 font-medium' : 'text-blue-600'}>
                                    Due: {dueDate.toLocaleDateString()} {isOverdue && '(Overdue)'}
                                  </span>
                                )}
                              </div>
                              <div className="mt-2"><a href={a.url} className="text-blue-600 underline">Download Assignment File</a></div>
                            </div>
                          </div>
                          {enrolled && (
                            <div className="mt-4 pt-4 border-t">
                              <StudentSubmissionBlock
                                courseId={id}
                                assignment={a}
                                existing={mySubmissions[a._id || a.filename || a.id]}
                                uploading={uploading}
                                onSubmitStart={()=>setUploading(true)}
                                onSubmitEnd={()=>setUploading(false)}
                                onSubmitted={(sub)=> setMySubmissions(prev=>({ ...prev, [a._id || a.filename || a.id]: sub }))}
                              />
                            </div>
                          )}
                        </li>
                      )
                    })}
                    {(!(course.assignments||[]).length) && <div className="text-sm text-gray-500">No assignments added yet</div>}
                  </ul>
                </div>
              )}

              {tab==='announcements' && (
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold mb-3">Announcements</h3>
                  <div className="space-y-3">
                    {(course.announcements||[]).length === 0 && (
                      <div className="text-sm text-gray-500">No announcements yet</div>
                    )}
                    {(course.announcements||[]).map(an=> (
                      <div key={an._id} className="p-4 border rounded">
                        <div className="font-semibold text-lg">{an.title}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {new Date(an.createdAt||Date.now()).toLocaleString()}
                        </div>
                        <div className="mt-2 text-sm text-gray-700">{an.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab==='attendance' && (
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold mb-2">Attendance</h3>
                  <AttendanceList courseId={id} userId={user?.id} />
                </div>
              )}

              {tab==='discussions' && (
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold mb-2">Discussions</h3>
                  <div className="text-sm text-gray-500">Course discussions live here. (Forum view)</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function AttendanceList({ courseId, userId }){
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(false)

  const loadAttendance = async ()=>{
    setLoading(true)
    try{
      const res = await API.get(`/attendance/course/${courseId}`)
      setAttendance(res.data.records || [])
    } catch (err){ 
      console.error('Failed to load attendance', err) 
    }
    setLoading(false)
  }

  useEffect(()=>{
    loadAttendance()
  },[courseId])

  const handleMarkPresent = async (attendanceId)=>{
    try{
      const res = await API.post(`/attendance/mark/${attendanceId}`)
      if (res.data.success) {
        showToast('Marked present successfully', 'success')
        loadAttendance()
      }
    } catch (err){
      const msg = err?.response?.data?.msg || 'Failed to mark attendance'
      showToast(msg, 'error')
    }
  }

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>
  if (!attendance.length) return <div className="text-sm text-gray-500">No attendance sessions yet</div>
  
  return (
    <div className="space-y-4">
      {attendance.map(record => {
        const isPresent = record.presentStudents.includes(userId)
        const isOpen = record.status === 'open'
        
        return (
          <div key={record._id} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{new Date(record.date).toLocaleString()}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {record.presentStudents.length} / {record.totalEnrolled} students marked present
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Status: {isOpen ? '🟢 Open for marking' : '🔴 Closed'}
                </div>
              </div>
              <div>
                {isPresent ? (
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded font-medium text-sm">
                    ✓ Present
                  </div>
                ) : isOpen ? (
                  <button 
                    onClick={() => handleMarkPresent(record._id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Mark Present
                  </button>
                ) : (
                  <div className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm">
                    Absent
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function StudentSubmissionBlock({ courseId, assignment, existing, uploading, onSubmitStart, onSubmitEnd, onSubmitted }){
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [percent, setPercent] = useState(0)

  const handleSubmit = async ()=>{
    if (!file) return showToast('Please choose a file', 'error')
    try{
      onSubmitStart && onSubmitStart()
      setBusy(true)
      setPercent(0)
      const res = await submitAssignment(courseId, assignment._id || assignment.filename || assignment.id, file, (p)=> setPercent(p))
      if (res && res.submission) {
        showToast(res.updated ? 'Resubmission saved' : 'Submission uploaded', 'success')
        onSubmitted && onSubmitted(res.submission)
      } else {
        showToast('Upload completed', 'success')
      }
    } catch (err){
      console.error(err)
      const msg = err?.response?.data?.msg || 'Failed to submit'
      showToast(msg, 'error')
    } finally{
      setBusy(false)
      onSubmitEnd && onSubmitEnd()
      setTimeout(()=>setPercent(0), 800)
    }
  }

  return (
    <div className="mt-2">
      {existing ? (
        <div className="p-2 border rounded bg-gray-50">
          <div className="text-sm">You submitted: <a className="text-blue-600" href={existing.url} target="_blank" rel="noreferrer">{existing.originalName || existing.filename}</a></div>
          <div className="text-sm">Submitted: {new Date(existing.submittedAt).toLocaleString()}</div>
          {existing.grade !== undefined && <div className="text-sm mt-1">Grade: <strong>{existing.grade}</strong></div>}
          {existing.feedback && <div className="text-sm mt-1">Feedback: {existing.feedback}</div>}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input type="file" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
            <button disabled={busy || uploading} onClick={handleSubmit} className="px-3 py-1 bg-green-600 text-white rounded">{busy? 'Uploading...' : 'Submit'}</button>
          </div>
          {busy && (
            <div className="w-full bg-gray-100 rounded h-2 overflow-hidden">
              <div className="h-2 bg-green-500" style={{ width: `${percent}%` }} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
