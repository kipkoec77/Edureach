import React from 'react'
import { Link } from 'react-router-dom'

export default function Hero(){
  return (
    <section className="hero-gradient text-white h-screen w-full flex items-center">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-6">
          <div>
            <h1 className="text-5xl font-bold leading-tight">Quality Education for Everyone</h1>
            <p className="mt-6 text-lg text-indigo-100/90 max-w-xl">Edureach brings tutors and learners together with accessible courses, progress tracking, and a strong community focus — build skills that matter.</p>
            <div className="mt-8 flex gap-4">
              <Link to="/courses" className="btn-primary">Get Started</Link>
              <Link to="/about" className="btn-secondary">Learn More</Link>
            </div>
          </div>

          <div className="relative">
            <div className="soft-card p-6 rounded-2xl shadow-card-md">
              <img src="https://images.unsplash.com/photo-1529336953129-27f3b3d0a17f?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=7e6fc1c8b6b3ad720c2f9f8d1e7a0ad0" alt="learning" className="w-full h-64 object-cover rounded-xl" />
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-indigo-700">Featured: Digital Literacy Essentials</h4>
                <p className="text-sm text-indigo-600 mt-1">Hands-on lessons, downloadable notes, and video tutorials from expert tutors.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
