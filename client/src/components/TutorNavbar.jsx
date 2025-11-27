import React from 'react'
import { Bell, Search } from 'lucide-react'

export default function TutorNavbar(){
  return (
    <header className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-md">
      <div className="flex items-center gap-4">
        <div className="hidden md:block text-lg font-semibold text-gray-700">Tutor Dashboard</div>
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
          <Search className="w-4 h-4 text-gray-500" />
          <input placeholder="Search..." className="ml-2 bg-transparent outline-none text-sm" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded hover:bg-gray-50"><Bell className="w-5 h-5 text-gray-600"/></button>
        <div className="flex items-center gap-2">
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" alt="avatar" className="w-9 h-9 rounded-full"/>
          <div className="text-sm">
            <div className="font-medium">You</div>
            <div className="text-xs text-gray-400">Tutor</div>
          </div>
        </div>
      </div>
    </header>
  )
}
