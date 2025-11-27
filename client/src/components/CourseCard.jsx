import React from 'react'
import Card from './ui/Card'
import { Link } from 'react-router-dom'

export default function CourseCard({ course }){
  return (
    <Card className="hover:shadow-lg transition">
      <div className="flex flex-col">
        <div className="w-full h-40 bg-gray-200 rounded-md overflow-hidden">
          {course.thumbnailURL ? (
            <img src={course.thumbnailURL} alt={course.title} className="w-full h-full object-cover" />
          ) : (<div className="w-full h-full bg-gray-200" />)}
        </div>
        <div className="mt-3">
          <h3 className="font-semibold text-lg">{course.title}</h3>
          <p className="text-sm text-gray-500">{course.subject || course.category} • {course.tutorId?.name || course.instructorName || 'Unknown'}</p>
          <div className="mt-3 flex items-center justify-between">
            <Link to={`/courses/${course._id}`} className="text-blue-600">View Course</Link>
            <span className="text-sm text-gray-400">{course.createdAt ? new Date(course.createdAt).toLocaleDateString() : ''}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
