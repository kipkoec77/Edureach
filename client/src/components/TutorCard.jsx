import React from 'react'

export default function TutorCard({ tutor }){
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card-md">
      <div className="flex items-center gap-4">
        <img src={tutor?.avatar || 'https://images.unsplash.com/photo-1531123414780-f72b2f9e37d7'} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
        <div>
          <div className="font-semibold text-lg text-text-main">{tutor?.name || 'Tutor Name'}</div>
          <div className="text-sm text-text-muted">{(tutor?.subjects||[]).slice(0,3).join(', ')}</div>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600">{tutor?.bio || 'Experienced tutor focusing on practical skills and inclusive teaching.'}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">{tutor?.ratings ? `${tutor.ratings} ★` : 'New'}</div>
        <button className="btn-primary">View Profile</button>
      </div>
    </div>
  )
}
