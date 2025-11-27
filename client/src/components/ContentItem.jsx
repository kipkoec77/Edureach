import React from 'react'

export default function ContentItem({ item, onDelete }){
  return (
    <div className="bg-white rounded-xl shadow p-3">
      <div className="flex items-center gap-3">
        <div className="w-16 h-12 bg-gray-100 rounded" />
        <div className="flex-1">
          <div className="font-medium">{item.title}</div>
          <div className="text-sm text-gray-400">Used in: {item.usedIn.join(', ')}</div>
        </div>
        <div className="flex gap-2">
          <button className="text-sm text-blue-600">Replace</button>
          <button onClick={()=>onDelete?.(item)} className="text-sm text-red-600">Delete</button>
        </div>
      </div>
    </div>
  )
}
