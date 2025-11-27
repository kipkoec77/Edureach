import React from 'react'
import { Bell, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function StudentNavbar(){
  const { user } = useAuth()
  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">Hi{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!</div>
        <div className="font-semibold">Welcome back — keep learning</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
          <Search className="w-4 h-4 text-gray-500" />
          <input className="ml-2 bg-transparent outline-none text-sm" placeholder="Search courses..." />
        </div>
        <button className="p-2 rounded hover:bg-gray-50"><Bell className="w-5 h-5 text-gray-600"/></button>
      </div>
    </div>
  )
}
