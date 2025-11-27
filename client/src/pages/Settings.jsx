import React, { useState } from 'react'
import TutorSidebar from '../components/TutorSidebar'
import TutorNavbar from '../components/TutorNavbar'

export default function Settings(){
  const [profile, setProfile] = useState({ name:'You', bio:'', education:'', theme:'light' })

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full px-6">
        <div className="md:col-span-1 w-full"><TutorSidebar/></div>
        <div className="md:col-span-3 space-y-6 w-full">
          <TutorNavbar/>
          <h2 className="text-2xl font-semibold">Settings</h2>
          <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <input value={profile.name} onChange={e=>setProfile({...profile, name:e.target.value})} className="w-full border p-2 rounded" />
              <div className="text-sm text-gray-500 mt-2">Bio</div>
              <textarea value={profile.bio} onChange={e=>setProfile({...profile, bio:e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Education</div>
              <input value={profile.education} onChange={e=>setProfile({...profile, education:e.target.value})} className="w-full border p-2 rounded" />
              <div className="text-sm text-gray-500 mt-2">Theme</div>
              <select value={profile.theme} onChange={e=>setProfile({...profile, theme:e.target.value})} className="w-full border p-2 rounded">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  )
}
