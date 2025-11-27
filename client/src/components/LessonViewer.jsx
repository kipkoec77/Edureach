import React from 'react'

export default function LessonViewer({ lesson }){
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card-md">
      <h3 className="text-xl font-semibold">{lesson?.title || 'Lesson title'}</h3>
      <div className="mt-4">
        {lesson?.videoURL ? (
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
            <iframe title="lesson-video" src={lesson.videoURL} className="w-full h-full" frameBorder="0" allowFullScreen />
          </div>
        ) : (
          <div className="w-full h-56 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">No video</div>
        )}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>{lesson?.description || 'Lesson notes and description go here.'}</p>
      </div>
    </div>
  )
}
