import React from 'react'

export default function AnnouncementCard({ announcement }){
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold">{announcement.title}</div>
          <div className="text-xs text-gray-400">{new Date(announcement.createdAt || announcement.date || Date.now()).toLocaleDateString()}</div>
          <p className="text-sm text-gray-600 mt-2">{(announcement.content||announcement.body||'').slice(0,160)}{(announcement.content||announcement.body||'').length>160?'...':''}</p>
        </div>
      </div>
    </div>
  )
}
