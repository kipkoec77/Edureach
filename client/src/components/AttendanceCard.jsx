import React from 'react'

function Badge({ status }){
  const cls = status === 'Present' ? 'bg-green-100 text-green-700' : status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
  return <span className={`px-2 py-1 rounded text-xs ${cls}`}>{status}</span>
}

export default function AttendanceCard({ attendance }){
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{attendance.courseTitle || attendance.courseName}</div>
          <div className="text-xs text-gray-500">{new Date(attendance.date).toLocaleDateString()}</div>
        </div>
        <Badge status={attendance.status || (attendance.present ? 'Present' : 'Absent')} />
      </div>
    </div>
  )
}
