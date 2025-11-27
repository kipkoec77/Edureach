import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getStudentCourses } from '../services/api'
import StudentHeaderNav from '../components/StudentHeaderNav'

export default function StudentCourses(){
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [level, setLevel] = useState('')

  useEffect(()=>{
    if (!user) return
    load()
  },[user])

  async function load(){
    setLoading(true)
    setError(null)
    try {
      // Primary axios call
      const data = await getStudentCourses()
      const list = data.courses || []
      setCourses(list)
      console.log('[StudentCourses] Loaded via axios, count=', list.length)
    } catch (e){
      console.error('Failed to load student courses', e)
      setError(e.response?.data?.msg || 'Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const filtered = courses.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !category || c.category === category
    const matchLevel = !level || c.level === level
    return matchSearch && matchCategory && matchLevel
  })

  const categories = [...new Set(courses.map(c => c.category).filter(Boolean))]
  const levels = [...new Set(courses.map(c => c.level).filter(Boolean))]

  return (
    <main className="min-h-screen bg-gray-50 w-full">
      <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-6">
        <StudentHeaderNav />
        <section className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold">My Enrolled Courses</h1>
                <button onClick={()=>navigate('/student/browse')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Browse More</button>
              </div>
              <p className="text-gray-600">You are enrolled in {courses.length} {courses.length === 1 ? 'course' : 'courses'}.</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <input value={search} onChange={e=>setSearch(e.target.value)} type="text" placeholder="Search courses" className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full px-3 py-2 border rounded">
                    <option value="">All</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Level</label>
                  <select value={level} onChange={e=>setLevel(e.target.value)} className="w-full px-3 py-2 border rounded">
                    <option value="">All</option>
                    {levels.map(lv => <option key={lv} value={lv}>{lv}</option>)}
                  </select>
                </div>
              </div>
              {(search || category || level) && (
                <button onClick={()=>{ setSearch(''); setCategory(''); setLevel('') }} className="mt-4 text-sm text-blue-600 hover:underline">Clear filters</button>
              )}
            </div>

            {/* Content */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><span>📚</span> Enrolled Courses</h2>
              {loading && <div className="py-12 text-center text-gray-500">Loading courses...</div>}
              {error && !loading && <div className="py-8 text-center text-red-600">{error}</div>}
              {!loading && !error && filtered.length === 0 && (
                <div className="py-12 text-center">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-semibold mb-2">No courses match your filters</h3>
                  <p className="text-gray-600 mb-4">Try clearing filters or browsing for new courses</p>
                  <button onClick={()=>{ setSearch(''); setCategory(''); setLevel('') }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Reset Filters</button>
                  {courses.length === 0 && (
                    <div className="mt-6 text-sm text-gray-500">
                      You are not enrolled in any courses yet or data is still syncing.
                      <button onClick={load} className="ml-2 text-blue-600 underline">Refresh</button>
                    </div>
                  )}
                </div>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(course => (
                  <div key={course._id} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                      <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                      <div className="text-sm text-blue-100 flex items-center gap-2">
                        <span>{course.category || 'General'}</span>
                        <span>•</span>
                        <span>{course.level || 'All Levels'}</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-4">{course.description || 'No description available.'}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>👥 {course.students?.length || 0} students</span>
                        <span>📝 {course.assignments?.length || 0} assignments</span>
                      </div>
                      <Link to={`/courses/${course._id}/learn`} className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">Continue Learning →</Link>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500">Created {new Date(course.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
        </section>
      </div>
    </main>
  )
}
