import React from 'react'

export default function DiscussionThread({ thread }){
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="font-semibold">{thread.title}</div>
      <div className="text-sm text-gray-600 mt-2">{thread.snippet || thread.lastMessage || ''}</div>
    </div>
  )
}
