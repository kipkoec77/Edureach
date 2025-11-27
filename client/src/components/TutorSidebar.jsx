import React from 'react'
import { Link } from 'react-router-dom'

export default function TutorSidebar({ collapsed }){
  return (
    <aside className={`bg-white shadow-md rounded-xl p-4 w-full ${collapsed ? 'hidden md:block' : 'block'}`}>
      <div className="mb-6 px-2">
        <div className="text-lg font-bold text-gray-800">Tutor</div>
        <div className="text-sm text-gray-500">Instructor panel</div>
      </div>
      <nav className="space-y-1 text-sm">
        <Link to="/tutor" className="block px-3 py-2 rounded hover:bg-gray-50">Dashboard</Link>
        <div className="px-2 py-1 text-xs text-gray-400">Courses</div>
        <Link to="/tutor/courses" className="block px-3 py-2 rounded hover:bg-gray-50">My Courses</Link>
        <Link to="/tutor/students" className="block px-3 py-2 rounded hover:bg-gray-50">Students</Link>
        <Link to="/tutor/announcements" className="block px-3 py-2 rounded hover:bg-gray-50">Announcements</Link>
        <Link to="/tutor/messages" className="block px-3 py-2 rounded hover:bg-gray-50">Messages</Link>
        <Link to="/tutor/library" className="block px-3 py-2 rounded hover:bg-gray-50">Content Library</Link>
        <Link to="/tutor/settings" className="block px-3 py-2 rounded hover:bg-gray-50">Settings</Link>
        <button className="w-full text-left px-3 py-2 rounded hover:bg-red-50 text-red-600">Logout</button>
      </nav>
    </aside>
  )
}
