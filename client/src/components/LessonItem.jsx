import React from 'react'

export default function LessonItem({ lesson }){
  return (
    <div className="p-3 border rounded flex items-center justify-between">
      <div>
        <div className="font-medium">{lesson.title}</div>
        <div className="text-sm text-gray-500">{new Date(lesson.createdAt).toLocaleDateString()}</div>
      </div>
      <div>
        <a href={lesson.pdfURL} className="text-blue-600 text-sm mr-3" target="_blank" rel="noreferrer">Notes</a>
        <a href={lesson.videoURL} className="text-blue-600 text-sm" target="_blank" rel="noreferrer">Watch</a>
      </div>
    </div>
  )
}
