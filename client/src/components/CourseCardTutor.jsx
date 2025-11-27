import React from 'react'
import ProgressBar from './ProgressBar'

export default function CourseCardTutor({ course, onEdit, onDelete, onView }){
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-start gap-4">
        <div className="w-20 h-14 bg-gray-100 rounded overflow-hidden" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{course.title}</div>
              <div className="text-sm text-gray-500">{course.status} • {course.students} students</div>
            </div>
            <div className="text-sm text-gray-400">{course.completion}%</div>
          </div>
          <div className="mt-3">
            <ProgressBar value={course.completion} />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={()=>onEdit?.(course)} className="px-3 py-1 bg-gray-100 rounded">Edit</button>
            <button onClick={()=>onView?.(course)} className="px-3 py-1 bg-blue-600 text-white rounded">View</button>
            <button onClick={()=>onDelete?.(course)} className="px-3 py-1 bg-red-50 text-red-600 rounded">Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}
