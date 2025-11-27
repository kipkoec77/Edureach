import React from 'react'

export default function StatsCard({ label, value, icon }){
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
          <div className="text-sm text-gray-500">{label}</div>
        </div>
        <div className="text-blue-600 bg-blue-50 rounded p-2">{icon}</div>
      </div>
    </div>
  )
}
