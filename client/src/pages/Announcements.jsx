import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import TutorSidebar from '../components/TutorSidebar'
import TutorNavbar from '../components/TutorNavbar'
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../services/api'
import showToast from '../utils/toast'

export default function Announcements(){
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  useEffect(()=>{
    if (!user) return
    loadCourses()
  },[user])

  const loadCourses = async ()=>{
    try{
      const res = await fetch('/api/courses')
      const data = await res.json()
      const myCourses = (data.courses || []).filter(c => c.createdBy === user._id)
      setCourses(myCourses)
    } catch (err){ console.error(err) }
  }

  const openCreateModal = (courseId)=>{
    setSelectedCourseId(courseId)
    setEditingAnnouncement(null)
    setTitle('')
    setMessage('')
    setShowModal(true)
  }

  const openEditModal = (courseId, announcement)=>{
    setSelectedCourseId(courseId)
    setEditingAnnouncement(announcement)
    setTitle(announcement.title)
    setMessage(announcement.message)
    setShowModal(true)
  }

  const closeModal = ()=>{
    setShowModal(false)
    setEditingAnnouncement(null)
    setTitle('')
    setMessage('')
  }

  const handleSave = async ()=>{
    if (!title.trim() || !message.trim()) {
      showToast('Title and message are required', 'error')
      return
    }

    try{
      if (editingAnnouncement){
        await updateAnnouncement(selectedCourseId, editingAnnouncement._id, title, message)
        showToast('Announcement updated', 'success')
      } else {
        await createAnnouncement(selectedCourseId, title, message)
        showToast('Announcement created', 'success')
      }
      closeModal()
      loadCourses()
    } catch (err){
      console.error(err)
      showToast('Failed to save announcement', 'error')
    }
  }

  const handleDelete = async (courseId, announcementId)=>{
    if (!confirm('Delete this announcement?')) return
    try{
      await deleteAnnouncement(courseId, announcementId)
      showToast('Announcement deleted', 'success')
      loadCourses()
    } catch (err){
      console.error(err)
      showToast('Failed to delete announcement', 'error')
    }
  }

  // Flatten all announcements with course info
  const allAnnouncements = courses.flatMap(course => 
    (course.announcements || []).map(ann => ({
      ...ann,
      courseId: course._id,
      courseTitle: course.title
    }))
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full px-6">
        <div className="md:col-span-1 w-full"><TutorSidebar/></div>
        <div className="md:col-span-3 space-y-6 w-full">
          <TutorNavbar/>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Announcements</h2>
          </div>

          {/* Quick Create Buttons by Course */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-3">Create Announcement</h3>
            <div className="flex flex-wrap gap-2">
              {courses.map(course => (
                <button 
                  key={course._id}
                  onClick={()=>openCreateModal(course._id)}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  + {course.title}
                </button>
              ))}
              {courses.length === 0 && (
                <div className="text-sm text-gray-500">You don't have any courses yet</div>
              )}
            </div>
          </div>

          {/* All Announcements List */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-3">All Announcements</h3>
            <div className="space-y-3">
              {allAnnouncements.length === 0 && (
                <div className="text-sm text-gray-500">No announcements yet</div>
              )}
              {allAnnouncements.map(ann => (
                <div key={`${ann.courseId}-${ann._id}`} className="p-4 border rounded">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{ann.title}</div>
                      <div className="text-sm text-blue-600 mt-1">Course: {ann.courseTitle}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {new Date(ann.createdAt).toLocaleString()}
                      </div>
                      <div className="mt-2 text-sm text-gray-700">{ann.message}</div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={()=>openEditModal(ann.courseId, ann)}
                        className="px-2 py-1 bg-yellow-500 text-white text-sm rounded"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={()=>handleDelete(ann.courseId, ann._id)}
                        className="px-2 py-1 bg-red-600 text-white text-sm rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">
              {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
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
                {editingAnnouncement ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
