import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function StudentHeaderNav(){
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  
  const links = [
    { to: '/', label: 'Home' },
    { to: '/student', label: 'Dashboard' },
    { to: '/student/browse', label: 'Browse Courses' },
    { to: '/student/courses', label: 'My Courses' },
    { to: '/student/assignments', label: 'Assignments' },
    { to: '/student/attendance', label: 'Attendance' },
    { to: '/student/discussions', label: 'Discussions' },
    { to: '/student/announcements', label: 'Announcements' },
    { to: '/profile', label: 'Profile' }
  ]

  return (
    <div className="sticky top-0 z-40">
      <nav className="backdrop-blur bg-white/90 border-b px-4 md:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="font-bold text-blue-600 whitespace-nowrap">Student Panel</div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            {links.map(l => {
              const active = location.pathname === l.to
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={
                    `px-3 py-1.5 text-sm rounded-md transition font-medium whitespace-nowrap ` +
                    (active ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-blue-50')
                  }
                >
                  {l.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <div className="md:hidden mt-3 pb-2 flex flex-col gap-2">
            {links.map(l => {
              const active = location.pathname === l.to
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={
                    `px-4 py-2 text-sm rounded-md transition font-medium ` +
                    (active ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-blue-50')
                  }
                >
                  {l.label}
                </Link>
              )
            })}
          </div>
        )}
      </nav>
    </div>
  )
}