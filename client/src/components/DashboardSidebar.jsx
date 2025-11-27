import React from 'react'
import { Link } from 'react-router-dom'

export default function DashboardSidebar({ className='' }){
  return (
    <aside className={`w-64 bg-white p-6 border-r ${className}`}>
      <div className="text-lg font-semibold mb-6">Menu</div>
      <nav className="flex flex-col space-y-2 text-sm">
        <Link to="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-light-gray-bg">Overview</Link>
        <Link to="/dashboard/courses" className="block px-3 py-2 rounded-lg hover:bg-light-gray-bg">My Courses</Link>
        <Link to="/dashboard/progress" className="block px-3 py-2 rounded-lg hover:bg-light-gray-bg">Progress</Link>
        <Link to="/dashboard/quizzes" className="block px-3 py-2 rounded-lg hover:bg-light-gray-bg">Quizzes</Link>
        <Link to="/dashboard/messages" className="block px-3 py-2 rounded-lg hover:bg-light-gray-bg">Messages</Link>
      </nav>
    </aside>
  )
}
