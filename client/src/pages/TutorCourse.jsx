import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { listSubmissions, gradeSubmission, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../services/api'
import showToast from '../utils/toast'
import { StudentsTab, SettingsTab, DiscussionTab, AnalyticsTab, SyllabusTab } from '../components/CourseTabs'

export default function TutorCourse(){
  const { id } = useParams()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [tab, setTab] = useState('notes')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [submissionsMap, setSubmissionsMap] = useState({})

  const loadCourse = async ()=>{
    setLoading(true)
    try{
      const res = await fetch(`/api/courses/${id}`)
      const data = await res.json()
      setCourse(data.course)
    } catch (err){ console.error(err) }
    setLoading(false)
  }

  const loadAttendance = async ()=>{
    try{
      const res = await fetch(`/api/attendance/course/${id}`)
      const data = await res.json()
      setAttendance(data.records || [])
    } catch (err){ console.error(err) }
  }

  useEffect(()=>{ loadCourse(); loadAttendance() }, [id])

  useEffect(()=>{
    if (tab !== 'assignments' || !course) return
    // load submissions for each assignment
    (async ()=>{
      try{
        const map = {}
        for (const a of (course.assignments || [])){
          try{
            const res = await listSubmissions(id, a._id || a.filename || a.id)
            map[a._id || a.filename || a.id] = res.submissions || []
          } catch (e){ console.error(e) }
        }
        setSubmissionsMap(map)
      } catch (err){ console.error(err) }
    })()
  },[tab, course?.assignments, id])

  const uploadFile = async (type)=>{
    if (!file) return alert('Select a file')
    const fd = new FormData()
    fd.append('file', file)
    const url = `/api/courses/${id}/${type==='notes'?'upload-note':'upload-assignment'}`
    const res = await fetch(url, { method: 'POST', body: fd })
    if (res.ok) { await loadCourse(); setFile(null); alert('Uploaded') }
    else alert('Upload failed')
  }

  const takeAttendanceNow = async ()=>{
    const res = await fetch(`/api/attendance/create/${id}`, { method: 'POST', headers: { 'Content-Type':'application/json' } })
    if (res.ok){ 
      await loadAttendance(); 
      showToast('Attendance session created. Students can now mark themselves present.', 'success')
    } else {
      showToast('Failed to create attendance session', 'error')
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (!course) return <div className="p-4">Course not found</div>

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full px-6 space-y-4">
        <h2 className="text-2xl font-semibold">{course.title}</h2>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setTab('notes')} className={`px-3 py-1 rounded ${tab==='notes'?'bg-blue-600 text-white':'bg-white'}`}>Notes</button>
          <button onClick={()=>setTab('assignments')} className={`px-3 py-1 rounded ${tab==='assignments'?'bg-blue-600 text-white':'bg-white'}`}>Assignments</button>
          <button onClick={()=>setTab('attendance')} className={`px-3 py-1 rounded ${tab==='attendance'?'bg-blue-600 text-white':'bg-white'}`}>Attendance</button>
          <button onClick={()=>setTab('announcements')} className={`px-3 py-1 rounded ${tab==='announcements'?'bg-blue-600 text-white':'bg-white'}`}>Announcements</button>
          <button onClick={()=>setTab('students')} className={`px-3 py-1 rounded ${tab==='students'?'bg-blue-600 text-white':'bg-white'}`}>Students</button>
          <button onClick={()=>setTab('settings')} className={`px-3 py-1 rounded ${tab==='settings'?'bg-blue-600 text-white':'bg-white'}`}>Settings</button>
          <button onClick={()=>setTab('discussion')} className={`px-3 py-1 rounded ${tab==='discussion'?'bg-blue-600 text-white':'bg-white'}`}>Discussion</button>
          <button onClick={()=>setTab('analytics')} className={`px-3 py-1 rounded ${tab==='analytics'?'bg-blue-600 text-white':'bg-white'}`}>Analytics</button>
          <button onClick={()=>setTab('syllabus')} className={`px-3 py-1 rounded ${tab==='syllabus'?'bg-blue-600 text-white':'bg-white'}`}>Syllabus</button>
        </div>

        {tab==='notes' && (
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Upload Note</h3>
            <input type="file" onChange={e=>setFile(e.target.files[0])} />
            <div className="mt-2">
              <button onClick={()=>uploadFile('notes')} className="px-3 py-1 bg-green-600 text-white rounded">Upload</button>
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Notes</h4>
              <ul className="space-y-2">
                {course.notes?.length ? course.notes.map(n=> (
                  <li key={n._id} className="p-2 border rounded">
                    <a className="text-blue-600 underline" href={n.url} target="_blank" rel="noreferrer">{n.originalName}</a>
                    <div className="text-xs text-gray-500">{new Date(n.uploadedAt).toLocaleString()}</div>
                  </li>
                )) : <li className="text-sm text-gray-500">No notes uploaded</li>}
              </ul>
            </div>
          </div>
        )}

        {tab==='assignments' && (
          <div className="bg-white p-4 rounded shadow">
            <AssignmentUploadForm courseId={id} onUploadComplete={loadCourse} />
            <div className="mt-4">
              <h4 className="font-medium mb-2">Assignments</h4>
              <ul className="space-y-2">
                {course.assignments?.length ? course.assignments.map(a=> (
                  <li key={a._id || a.filename || a.id} className="p-2 border rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <a className="text-blue-600 underline" href={a.url} target="_blank" rel="noreferrer">{a.originalName}</a>
                        <div className="text-xs text-gray-500">{new Date(a.uploadedAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h5 className="font-medium">Submissions</h5>
                      <div className="space-y-2 mt-2">
                        {(submissionsMap[a._id || a.filename || a.id] || []).map(s=> (
                          <div key={s._id} className="p-2 border rounded bg-gray-50 flex items-center justify-between">
                            <div>
                              <div className="text-sm">Student: {s.studentId}</div>
                              <div className="text-sm">Submitted: {new Date(s.submittedAt).toLocaleString()}</div>
                              <div className="text-sm"><a className="text-blue-600" href={s.url} target="_blank" rel="noreferrer">Download</a></div>
                              {s.grade !== undefined && <div className="text-sm">Grade: {s.grade}</div>}
                              {s.feedback && <div className="text-sm">Feedback: {s.feedback}</div>}
                            </div>
                            <div className="w-64">
                              <GradeForm submission={s} onGraded={(updated)=>{
                                // update map locally
                                setSubmissionsMap(prev=>{
                                  const key = a._id || a.filename || a.id
                                  const list = (prev[key]||[]).map(x=> x._id===updated._id? updated : x)
                                  return { ...prev, [key]: list }
                                })
                              }} />
                            </div>
                          </div>
                        ))}
                        {(!(submissionsMap[a._id || a.filename || a.id]||[]).length) && (
                          <div className="text-sm text-gray-500">No submissions yet</div>
                        )}
                      </div>
                    </div>
                  </li>
                )) : <li className="text-sm text-gray-500">No assignments uploaded</li>}
              </ul>
            </div>
          </div>
        )}

        {tab==='attendance' && (
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Attendance</h3>
              <button onClick={takeAttendanceNow} className="px-3 py-1 bg-blue-600 text-white rounded">Take Attendance Now</button>
            </div>
            <div className="space-y-4">
              {attendance.length === 0 && <div className="text-sm text-gray-500">No attendance sessions created yet</div>}
              {attendance.map(a=> (
                <div key={a._id} className="border rounded p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium">{new Date(a.date).toLocaleString()}</div>
                      <div className="text-sm text-gray-600">
                        {a.presentStudents.length} / {a.totalEnrolled} students marked present
                      </div>
                      <div className="text-xs text-gray-500">Status: {a.status === 'open' ? '🟢 Open' : '🔴 Closed'}</div>
                    </div>
                    {a.status === 'open' && (
                      <button 
                        onClick={async ()=>{
                          const res = await fetch(`/api/attendance/close/${a._id}`, { method: 'PATCH' })
                          if (res.ok) { loadAttendance(); showToast('Session closed', 'success') }
                        }}
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded"
                      >
                        Close Session
                      </button>
                    )}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium mb-1">Present Students:</div>
                    {a.presentStudents.length === 0 ? (
                      <div className="text-gray-500">No students marked present yet</div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {a.presentStudents.map((sid, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            {sid}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='announcements' && (
          <AnnouncementsTab courseId={id} announcements={course.announcements || []} onUpdate={loadCourse} />
        )}

        {tab==='students' && (
          <StudentsTab course={course} />
        )}

        {tab==='settings' && (
          <SettingsTab course={course} onUpdate={loadCourse} />
        )}

        {tab==='discussion' && (
          <DiscussionTab courseId={id} />
        )}

        {tab==='analytics' && (
          <AnalyticsTab course={course} attendance={attendance} submissionsMap={submissionsMap} />
        )}

        {tab==='syllabus' && (
          <SyllabusTab courseId={id} course={course} onUpdate={loadCourse} />
        )}

      </div>
    </div>
  )
}

function AssignmentUploadForm({ courseId, onUploadComplete }){
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleUpload = async ()=>{
    if (!file || !title) return showToast('Please select a file and enter title', 'error')
    setUploading(true)
    try{
      const fd = new FormData()
      fd.append('file', file)
      fd.append('title', title)
      if (description) fd.append('description', description)
      if (dueDate) fd.append('dueDate', dueDate)
      
      const res = await fetch(`/api/courses/${courseId}/upload-assignment`, { method: 'POST', body: fd })
      if (res.ok) {
        showToast('Assignment uploaded', 'success')
        setFile(null); setTitle(''); setDescription(''); setDueDate('')
        onUploadComplete && onUploadComplete()
      } else {
        showToast('Upload failed', 'error')
      }
    } catch (err){ console.error(err); showToast('Error uploading', 'error') }
    setUploading(false)
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Upload Assignment</h3>
      <input 
        type="text" 
        placeholder="Assignment Title *" 
        value={title} 
        onChange={e=>setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea 
        placeholder="Description (optional)" 
        value={description} 
        onChange={e=>setDescription(e.target.value)}
        className="w-full p-2 border rounded"
        rows={3}
      />
      <input 
        type="datetime-local" 
        value={dueDate} 
        onChange={e=>setDueDate(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input type="file" onChange={e=>setFile(e.target.files[0])} className="w-full" />
      <button 
        onClick={handleUpload} 
        disabled={uploading}
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Assignment'}
      </button>
    </div>
  )
}

function GradeForm({ submission, onGraded }){
  const [grade, setGrade] = useState(submission.grade || '')
  const [feedback, setFeedback] = useState(submission.feedback || '')
  const [busy, setBusy] = useState(false)

  const handleGrade = async ()=>{
    setBusy(true)
    try{
      const res = await gradeSubmission(submission._id, { grade: grade === '' ? undefined : Number(grade), feedback })
      if (res && res.submission){
        onGraded && onGraded(res.submission)
        showToast('Grade saved', 'success')
      }
    } catch (err){ console.error(err); showToast('Failed to grade', 'error') }
    setBusy(false)
  }

  return (
    <div className="space-y-2">
      <input className="w-full p-1 border rounded" placeholder="Grade (number)" value={grade} onChange={e=>setGrade(e.target.value)} />
      <textarea className="w-full p-1 border rounded" placeholder="Feedback" value={feedback} onChange={e=>setFeedback(e.target.value)} />
      <div className="flex justify-end">
        <button disabled={busy} onClick={handleGrade} className="px-3 py-1 bg-blue-600 text-white rounded">{busy ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  )
}

// ===== ANNOUNCEMENTS TAB COMPONENT =====
function AnnouncementsTab({ courseId, announcements, onUpdate }){
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  const openCreateModal = ()=>{
    setEditingId(null)
    setTitle('')
    setMessage('')
    setShowModal(true)
  }

  const openEditModal = (announcement)=>{
    setEditingId(announcement._id)
    setTitle(announcement.title)
    setMessage(announcement.message)
    setShowModal(true)
  }

  const closeModal = ()=>{
    setShowModal(false)
    setEditingId(null)
    setTitle('')
    setMessage('')
  }

  const handleSave = async ()=>{
    if (!title.trim() || !message.trim()) {
      showToast('Title and message are required', 'error')
      return
    }

    try{
      if (editingId){
        await updateAnnouncement(courseId, editingId, title, message)
        showToast('Announcement updated', 'success')
      } else {
        await createAnnouncement(courseId, title, message)
        showToast('Announcement created', 'success')
      }
      closeModal()
      onUpdate()
    } catch (err){
      console.error(err)
      showToast('Failed to save announcement', 'error')
    }
  }

  const handleDelete = async (announcementId)=>{
    if (!confirm('Delete this announcement?')) return
    try{
      await deleteAnnouncement(courseId, announcementId)
      showToast('Announcement deleted', 'success')
      onUpdate()
    } catch (err){
      console.error(err)
      showToast('Failed to delete announcement', 'error')
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Announcements</h3>
        <button onClick={openCreateModal} className="px-3 py-1 bg-blue-600 text-white rounded">
          + New Announcement
        </button>
      </div>

      <div className="space-y-3">
        {announcements.length === 0 && (
          <div className="text-sm text-gray-500">No announcements yet</div>
        )}
        {announcements.map(a => (
          <div key={a._id} className="border rounded p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-semibold text-lg">{a.title}</div>
                <div className="text-sm text-gray-700 mt-1">{a.message}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(a.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={()=>openEditModal(a)}
                  className="px-2 py-1 bg-yellow-500 text-white text-sm rounded"
                >
                  Edit
                </button>
                <button 
                  onClick={()=>handleDelete(a._id)}
                  className="px-2 py-1 bg-red-600 text-white text-sm rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Announcement' : 'New Announcement'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={e=>setTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea 
                  value={message}
                  onChange={e=>setMessage(e.target.value)}
                  className="w-full p-2 border rounded h-32"
                  placeholder="Announcement message"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
