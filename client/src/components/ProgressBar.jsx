import React from 'react'

export default function ProgressBar({ value = 0 }){
  return (
    <div className="w-full">
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div style={{ width: `${value}%` }} className="h-3 bg-green-500" />
      </div>
    </div>
  )
}
