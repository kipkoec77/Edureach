import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function DashboardNavBar(){
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const role = user?.role || 'student'

  const studentLinks = [
    { to: '/student', label: 'Dashboard' },
    { to: '/student/browse', label: 'Browse' },
    { to: '/student/courses', label: 'My Courses' },
    { to: '/student/attendance', label: 'Attendance' },
    { to: '/student/assignments', label: 'Assignments' },
    { to: '/student/announcements', label: 'Announcements' }
  ]
  const tutorLinks = [
    { to: '/tutor', label: 'Dashboard' },
    { to: '/tutor/courses', label: 'Courses' },
    { to: '/tutor/students', label: 'Students' },
    { to: '/tutor/announcements', label: 'Announcements' },
    { to: '/tutor/messages', label: 'Messages' },
    { to: '/tutor/library', label: 'Library' },
    { to: '/tutor/settings', label: 'Settings' }
  ]
  const adminLinks = [ { to: '/admin', label: 'Dashboard' } ]

  const links = role === 'tutor' ? tutorLinks : role === 'admin' ? adminLinks : studentLinks
  const baseClass = 'rounded-md px-3 py-2 text-sm font-medium'
  const cls = isActive => isActive ? `${baseClass} bg-gray-900 text-white` : `${baseClass} text-gray-300 hover:bg-white/5 hover:text-white`

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="shrink-0 text-white font-bold text-xl">Edureach</div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {links.map(l => (
                  <NavLink key={l.to} to={l.to} className={({ isActive }) => cls(isActive)}>{l.label}</NavLink>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button type="button" className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
                <span className="sr-only">Notifications</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6" aria-hidden="true"><path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {user ? (
                <div className="ml-3 flex items-center gap-2">
                  <span className="text-sm text-gray-300">{user.name}</span>
                  <button onClick={logout} className="text-gray-300 hover:text-white text-sm">Logout</button>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-3">
                  <Link to="/login" className="text-gray-300 hover:text-white text-sm">Sign in</Link>
                  <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm">Register</Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button type="button" onClick={()=>setMobileOpen(v=>!v)} className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500" aria-expanded={mobileOpen}>
              <span className="sr-only">Toggle menu</span>
              {!mobileOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6" aria-hidden="true"><path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6" aria-hidden="true"><path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} onClick={()=>setMobileOpen(false)} className={({ isActive }) => isActive ? 'block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white' : 'block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white'}>{l.label}</NavLink>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 pb-3 px-5">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-300 truncate max-w-[140px]">{user.email}</div>
                <button onClick={logout} className="text-gray-300 hover:text-white text-sm">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-300 hover:text-white text-sm">Sign in</Link>
                <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
