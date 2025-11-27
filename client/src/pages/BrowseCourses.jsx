import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import StudentHeaderNav from '../components/StudentHeaderNav'
import API from '../services/api'
import showToast from '../utils/toast'

export default function BrowseCourses(){
  const { user } = useAuth()
  const navigate = useNavigate()
  const [allCourses, setAllCourses] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ category: '', level: '', search: '' })

  useEffect(() => {
    loadCourses()
  }, [user])

  const loadCourses = async () => {
    if (!user) return
    setLoading(true)
    try {
      // Fetch all courses
      const allRes = await fetch('/api/courses')
      const allData = await allRes.json()
      setAllCourses(allData.courses || [])

      // Fetch enrolled courses
      const enrolledRes = await API.get('/student/courses')
      const enrolledData = enrolledRes.data
      setEnrolledCourses(enrolledData.courses || [])
    } catch (err) {
      console.error('Failed to load courses', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId) => {
    try {
      await API.post(`/courses/${courseId}/enroll`)
      showToast('Successfully enrolled!', 'success')
      loadCourses() // Reload to update enrollment status
    } catch (err) {
      console.error(err)
      showToast(err.response?.data?.msg || 'Failed to enroll', 'error')
    }
  }

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(c => c._id === courseId)
  }

  // Filter courses
  const filteredCourses = allCourses.filter(course => {
    const matchCategory = !filter.category || course.category === filter.category
    const matchLevel = !filter.level || course.level === filter.level
    const matchSearch = !filter.search || 
      course.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      course.description?.toLowerCase().includes(filter.search.toLowerCase())
    return matchCategory && matchLevel && matchSearch
  })

  // Get unique categories and levels
  const categories = [...new Set(allCourses.map(c => c.category).filter(Boolean))]
  const levels = [...new Set(allCourses.map(c => c.level).filter(Boolean))]

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Loading courses...</div>
          <div className="text-gray-500">Please wait</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 w-full">
      <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-6">
        <StudentHeaderNav />
        <section className="space-y-6">
            
            {/* Page Header */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h1 className="text-3xl font-bold mb-2">Browse All Courses</h1>
              <p className="text-gray-600">Discover and enroll in courses from expert tutors</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Filter Courses</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={filter.search}
                    onChange={e => setFilter({...filter, search: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={filter.category}
                    onChange={e => setFilter({...filter, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Level</label>
                  <select
                    value={filter.level}
                    onChange={e => setFilter({...filter, level: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">All Levels</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
              {(filter.search || filter.category || filter.level) && (
                <button
                  onClick={() => setFilter({ category: '', level: '', search: '' })}
                  className="mt-4 text-sm text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Course Count */}
            <div className="text-sm text-gray-600">
              Showing {filteredCourses.length} of {allCourses.length} courses
            </div>

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => setFilter({ category: '', level: '', search: '' })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => {
                  const enrolled = isEnrolled(course._id)
                  
                  return (
                    <div key={course._id} className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden">
                      {/* Course Header */}
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                        <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-blue-100">
                          <span>{course.category || 'General'}</span>
                          <span>•</span>
                          <span>{course.level || 'All Levels'}</span>
                        </div>
                      </div>

                      {/* Course Details */}
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {course.description || 'No description available'}
                        </p>

                        {/* Course Stats */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <span>👥 {course.students?.length || 0} students</span>
                          <span>📝 {course.assignments?.length || 0} assignments</span>
                          <span>📄 {course.notes?.length || 0} notes</span>
                        </div>

                        {/* Action Button */}
                        {enrolled ? (
                          <button
                            onClick={() => navigate(`/courses/${course._id}`)}
                            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                          >
                            ✓ Enrolled - Continue Learning
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEnroll(course._id)}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                          >
                            Enroll Now
                          </button>
                        )}
                      </div>

                      {/* Course Footer */}
                      <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500">
                        Created {new Date(course.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

        </section>
      </div>
    </main>
  )
}
