import React from 'react'
import { Link } from 'react-router-dom'

export default function StudentSidebar({ className='' }){
  return (
    <aside className={`hidden lg:block w-72 ${className}`}>
      <div className="sticky top-24 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-lg font-bold">Student</div>
          <div className="text-sm text-gray-500">Learner panel</div>
        </div>

        <nav className="bg-white rounded-lg shadow p-3">
          <ul className="space-y-3 text-base font-medium">
            <li><Link to="/student" className="block px-4 py-2 rounded hover:bg-gray-50">Dashboard</Link></li>
            <li><Link to="/student/browse" className="block px-4 py-2 rounded hover:bg-blue-50 text-blue-600 font-semibold">📚 Browse Courses</Link></li>
            <li><Link to="/student/courses" className="block px-4 py-2 rounded hover:bg-gray-50">My Courses</Link></li>
            <li><Link to="/student/assignments" className="block px-4 py-2 rounded hover:bg-gray-50">Assignments</Link></li>
            <li><Link to="/student/attendance" className="block px-4 py-2 rounded hover:bg-gray-50">Attendance</Link></li>
            <li><Link to="/student/discussions" className="block px-4 py-2 rounded hover:bg-gray-50">Discussions</Link></li>
            <li><Link to="/student/announcements" className="block px-4 py-2 rounded hover:bg-gray-50">Announcements</Link></li>
            <li><Link to="/profile" className="block px-4 py-2 rounded hover:bg-gray-50">Profile</Link></li>
          </ul>
        </nav>
      </div>
    </aside>
  )
}
