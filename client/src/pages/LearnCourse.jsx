import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API, { getMySubmission, submitAssignment, getCourseDiscussions, postCourseDiscussion } from '../services/api'
import showToast from '../utils/toast'

export default function LearnCourse(){
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeModuleIdx, setActiveModuleIdx] = useState(0)
  const [submissions, setSubmissions] = useState({})
  const [uploadingId, setUploadingId] = useState(null)
  const [discussions, setDiscussions] = useState([])
  const [discussionLoading, setDiscussionLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(()=>{ if (user) loadCourse() },[user, id])

  async function loadCourse(){
    setLoading(true)
    try {
      const res = await API.get(`/courses/${id}`)
      const c = res.data.course || res.data
      setCourse(c)
      // load submission status per assignment for progress
      const map = {}
      for (const a of (c.assignments || [])){
        try {
          const subRes = await getMySubmission(id, a._id || a.filename || a.id)
          if (subRes?.submission) map[a._id || a.filename || a.id] = subRes.submission
        } catch(e){ /* ignore individual */ }
      }
      setSubmissions(map)
    } catch (e){ console.error('Failed to load course', e) }
    setLoading(false)
    // load discussions after course load
    loadDiscussions()
  }

  async function loadDiscussions(){
    setDiscussionLoading(true)
    try {
      const data = await getCourseDiscussions(id)
      setDiscussions(data.messages || [])
    } catch(e){ console.error('Failed to load discussions', e) }
    setDiscussionLoading(false)
  }

  async function handlePostMessage(){
    if (!newMessage.trim()) return
    const temp = { userId: user?.id || 'me', message: newMessage, timestamp: new Date().toISOString(), _temp: true }
    setDiscussions(prev => [temp, ...prev])
    setPosting(true)
    try {
      const data = await postCourseDiscussion(id, newMessage)
      // replace temp with actual or prepend if API returns single message
      if (data?.message){
        setDiscussions(prev => [data.message, ...prev.filter(m => !m._temp)])
      } else {
        // fallback reload
        loadDiscussions()
      }
      setNewMessage('')
      showToast('Message posted', 'success')
    } catch(e){ console.error(e); showToast('Failed to post', 'error') }
    setPosting(false)
  }

  const totalAssignments = (course?.assignments || []).length
  const submittedCount = Object.keys(submissions).length
  const progressPct = totalAssignments === 0 ? 0 : Math.round((submittedCount / totalAssignments) * 100)

  const nextAssignment = useMemo(()=>{
    const remaining = (course?.assignments || []).filter(a => !submissions[a._id || a.filename || a.id])
    if (!remaining.length) return null
    // sort by due date if available
    return remaining.sort((a,b)=> {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate) - new Date(b.dueDate)
    })[0]
  },[course, submissions])

  async function handleSubmitAssignment(assignment, file){
    if (!file) { showToast('Select a file first', 'error'); return }
    const key = assignment._id || assignment.filename || assignment.id
    setUploadingId(key)
    try {
      const res = await submitAssignment(id, key, file, ()=>{})
      if (res?.submission){
        setSubmissions(prev => ({ ...prev, [key]: res.submission }))
        showToast('Submission uploaded', 'success')
      } else showToast('Uploaded', 'success')
    } catch(e){ console.error(e); showToast('Failed to submit', 'error') }
    setUploadingId(null)
  }

  if (loading || !course) {
    return (
      <main className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Preparing your learning space...</div>
          <div className="text-gray-500">Loading course</div>
        </div>
      </main>
    )
  }

  const syllabus = course.syllabus || []
  const activeModule = syllabus[activeModuleIdx]

  return (
    <main className="min-h-screen bg-gray-50 w-full">
      <div className="w-full px-6 py-8 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg shadow text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">{course.title}</h1>
              <p className="text-blue-100 text-sm">{course.category || 'General'} • {course.level || 'All Levels'}</p>
              <p className="mt-3 max-w-2xl text-sm text-blue-50">{course.description || 'No description provided.'}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm">Progress</div>
              <div className="w-56 bg-white/20 h-3 rounded overflow-hidden">
                <div className="h-full bg-green-400" style={{ width: progressPct + '%' }} />
              </div>
              <div className="text-sm font-semibold">{submittedCount}/{totalAssignments} assignments • {progressPct}%</div>
              {nextAssignment && (
                <div className="text-xs bg-yellow-400/20 text-yellow-100 px-3 py-1 rounded">
                  Next: {nextAssignment.title} {nextAssignment.dueDate ? 'due ' + new Date(nextAssignment.dueDate).toLocaleDateString() : ''}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Syllabus & Notes */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">Syllabus</h2>
              {syllabus.length === 0 && <div className="text-sm text-gray-500">No syllabus modules yet</div>}
              <ul className="space-y-2">
                {syllabus.map((m, idx) => (
                  <li key={idx}>
                    <button
                      onClick={()=>setActiveModuleIdx(idx)}
                      className={`w-full text-left px-3 py-2 rounded border text-sm flex justify-between items-center hover:bg-gray-50 ${activeModuleIdx===idx ? 'bg-blue-50 border-blue-400' : 'border-gray-200'}`}
                    >
                      <span className="truncate font-medium">{m.title}</span>
                      <span className="text-xs text-gray-500">{m.topics?.length || 0} topics</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">Notes</h2>
              <ul className="space-y-2 text-sm">
                {(course.notes||[]).map(n => (
                  <li key={n._id} className="flex items-center justify-between">
                    <span className="truncate">{n.originalName}</span>
                    <a href={n.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Download</a>
                  </li>
                ))}
                {!(course.notes||[]).length && <li className="text-gray-500">No notes uploaded</li>}
              </ul>
            </div>
          </aside>

          {/* Center: Active Module / Content */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6 min-h-[280px]">
              <h2 className="text-xl font-semibold mb-2">{activeModule ? activeModule.title : 'Learning Content'}</h2>
              {activeModule?.description && <p className="text-sm text-gray-600 mb-4">{activeModule.description}</p>}
              {activeModule?.topics?.length ? (
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {activeModule.topics.map((t,i)=> <li key={i}>{t}</li>)}
                </ul>
              ) : (
                <div className="text-sm text-gray-500">Select a syllabus module on the left to view its topics.</div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Assignments</h2>
              <div className="space-y-4">
                {(course.assignments||[]).map(a => {
                  const key = a._id || a.filename || a.id
                  const sub = submissions[key]
                  const dueDate = a.dueDate ? new Date(a.dueDate) : null
                  const overdue = dueDate && dueDate < new Date()
                  return (
                    <div key={key} className="border rounded p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{a.title || a.originalName}</div>
                          {a.description && <div className="text-sm text-gray-600 mt-1">{a.description}</div>}
                          <div className="text-xs text-gray-500 mt-2 flex gap-4">
                            <span>Posted {new Date(a.createdAt||a.uploadedAt||Date.now()).toLocaleDateString()}</span>
                            {dueDate && <span className={overdue? 'text-red-600 font-medium':'text-blue-600'}>Due {dueDate.toLocaleDateString()}</span>}
                          </div>
                        </div>
                        <a href={a.url} className="text-blue-600 text-sm underline" target="_blank" rel="noreferrer">File</a>
                      </div>
                      <div className="mt-3">
                        {sub ? (
                          <div className="text-sm bg-green-50 border border-green-200 rounded p-2">
                            <div>Submitted: {new Date(sub.submittedAt).toLocaleString()}</div>
                            {sub.grade !== undefined && <div>Grade: <strong>{sub.grade}</strong></div>}
                            {sub.feedback && <div>Feedback: {sub.feedback}</div>}
                          </div>
                        ) : (
                          <AssignmentSubmitRow assignment={a} uploading={uploadingId===key} onSubmit={(file)=>handleSubmitAssignment(a,file)} />
                        )}
                      </div>
                    </div>
                  )
                })}
                {!(course.assignments||[]).length && <div className="text-sm text-gray-500">No assignments yet</div>}
              </div>
            </div>
          </section>

          {/* Right: Announcements & Activity */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">Announcements</h2>
              <div className="space-y-3">
                {(course.announcements||[]).slice(0,5).map(a => (
                  <div key={a._id} className="border rounded p-3 text-sm">
                    <div className="font-medium">{a.title}</div>
                    <div className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleString()}</div>
                    <div className="mt-1 text-gray-700">{a.message}</div>
                  </div>
                ))}
                {!(course.announcements||[]).length && <div className="text-sm text-gray-500">No announcements</div>}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">Course Stats</h2>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>Notes: {(course.notes||[]).length}</li>
                <li>Assignments: {(course.assignments||[]).length}</li>
                <li>Announcements: {(course.announcements||[]).length}</li>
                <li>Syllabus Modules: {syllabus.length}</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-2">Navigation</h2>
              <div className="flex flex-col gap-2">
                <button onClick={()=>navigate('/student')} className="px-3 py-2 bg-blue-600 text-white rounded text-sm">Back to Dashboard</button>
                <button onClick={()=>navigate('/student/courses')} className="px-3 py-2 bg-gray-100 rounded text-sm">My Courses</button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">Discussions</h2>
              <div className="space-y-3">
                <div>
                  <textarea
                    value={newMessage}
                    onChange={e=>setNewMessage(e.target.value)}
                    placeholder="Share something with the class..."
                    className="w-full p-2 border rounded h-20 text-sm"
                  />
                  <button
                    disabled={posting}
                    onClick={handlePostMessage}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
                  >
                    {posting ? 'Posting...' : 'Post'}
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {discussionLoading && <div className="text-xs text-gray-500">Loading...</div>}
                  {!discussionLoading && discussions.length === 0 && <div className="text-xs text-gray-500">No messages yet</div>}
                  {discussions.map((m, idx) => (
                    <div key={idx} className="border rounded p-2 bg-gray-50">
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-blue-600 truncate max-w-[120px]">{m.userId}</span>
                        <span className="text-[10px] text-gray-500">{new Date(m.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="text-xs mt-1 text-gray-700 whitespace-pre-wrap">{m.message}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button onClick={loadDiscussions} className="text-xs text-blue-600 hover:underline">Refresh</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

function AssignmentSubmitRow({ assignment, uploading, onSubmit }){
  const [file, setFile] = useState(null)
  return (
    <div className="flex items-center gap-2">
      <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} className="text-sm" />
      <button disabled={uploading} onClick={()=>onSubmit(file)} className="px-3 py-1 bg-green-600 text-white rounded text-sm disabled:opacity-50">
        {uploading ? 'Uploading...' : 'Submit'}
      </button>
    </div>
  )
}
