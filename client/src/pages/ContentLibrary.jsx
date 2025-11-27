import React, { useEffect, useState } from 'react'
import TutorSidebar from '../components/TutorSidebar'
import TutorNavbar from '../components/TutorNavbar'
import ContentItem from '../components/ContentItem'
import { useAuth } from '../context/AuthContext'

export default function ContentLibrary(){
  const { user } = useAuth()
  const [items, setItems] = useState([])

  const load = async ()=>{
    if (!user) return
    try{
      const res = await fetch(`/api/courses?tutorId=${user._id}`)
      const data = await res.json()
      const courses = data.courses || []
      const collected = []
      courses.forEach(c=>{
        (c.notes||[]).forEach(n=> collected.push({ ...n, type: 'note', courseTitle: c.title }))
        (c.assignments||[]).forEach(a=> collected.push({ ...a, type: 'assignment', courseTitle: c.title }))
      })
      setItems(collected)
    } catch (err){ console.error(err) }
  }

  useEffect(()=>{ load() }, [user])

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full px-6">
        <div className="md:col-span-1 w-full"><TutorSidebar/></div>
        <div className="md:col-span-3 space-y-6 w-full">
          <TutorNavbar/>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Content Library</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Upload New Content</button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((i, idx)=> <ContentItem key={idx} item={i} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
