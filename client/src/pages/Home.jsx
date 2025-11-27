import React from 'react'
import { Link } from 'react-router-dom'

const features = [
  { title: 'Interactive Courses', desc: 'Engaging lessons with quizzes and videos.', icon: 'book' },
  { title: 'Track Your Progress', desc: 'Monitor your learning journey and achievements.', icon: 'chart' },
  { title: 'Certified Learning', desc: 'Earn certificates to showcase your skills.', icon: 'badge' },
  { title: 'Mobile & Web', desc: 'Learn on any device, anytime.', icon: 'device' },
]

const sampleCourses = [
  { id: 1, title: 'Intro to Web Development', author: 'Jane Doe' },
  { id: 2, title: 'Data Science Basics', author: 'John Smith' },
  { id: 3, title: 'Effective Teaching Methods', author: 'A. Tutor' },
  { id: 4, title: 'Software Engineering Fundamentals', author: 'Prof. Alice' },
  { id: 5, title: 'Full-Stack Web Development', author: 'Dev Team' },
]

function Icon({ name, className = 'w-10 h-10 text-blue-500' }){
  if(name === 'book') return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v12m6-12v12M4 6h16v12H4z"/></svg>
  )
  if(name === 'chart') return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18"/><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M7 13v6M12 9v10M17 5v14"/></svg>
  )
  if(name === 'badge') return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 2l3 6 6 .5-4.5 4 1 6L12 16l-5.5 3.5 1-6L3 8.5 9.5 8 12 2z"/></svg>
  )
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.5"/></svg>
  )
}

export default function Home(){
  return (
    <div className="w-full">
      {/* Hero: cream background, left content, right image with circular red backdrop */}
      <main className="w-full min-h-screen bg-amber-50 relative">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left column */}
            <div className="md:w-1/2 text-left animate-fade-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mt-6">Learning Platform in The World</h1>
              <p className="mt-6 text-gray-700 max-w-xl">Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has survived not only five centuries but also the leap into electronic typesetting.</p>

              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link to="/signup" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300">Register Now</Link>
                <Link to="/about" className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">Learn More</Link>
              </div>

              <p className="mt-4 text-sm text-gray-500">Join 10,000+ learners worldwide</p>
            </div>

            {/* Right column: decorative circle + image */}
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div className="relative w-full max-w-md">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=1d2d9f6a4f3a7f6b7c2e3f8a9a6b4c2d" alt="Student working on a laptop" loading="lazy" className="relative rounded-xl shadow-2xl w-full object-cover transform lg:-translate-x-6" />
              </div>
            </div>
          </div>
        </div>
        {/* decorative wave to transition to next (white) section and fill negative space */}
        <svg className="absolute left-0 right-0 -bottom-1 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
          <path d="M0,40 C200,100 400,0 720,40 C1040,80 1240,20 1440,40 L1440,80 L0,80 Z" fill="#ffffff" />
        </svg>
      </main>

      {/* Features (kept simple and aligned with new styles) */}
      <section id="features" className="py-20 bg-white text-center px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <h3 className="font-semibold text-xl mb-2">Peer Learning</h3>
              <p className="text-gray-600">Collaborate with fellow students and help each other learn.</p>
            </div>
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <h3 className="font-semibold text-xl mb-2">Course Library</h3>
              <p className="text-gray-600">Access curated courses and learning materials anytime.</p>
            </div>
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <h3 className="font-semibold text-xl mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your growth and stay motivated with analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-amber-50 text-center px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg">
              <p className="text-gray-600 mb-4">“Edureach helped me improve my grades and learn from peers!”</p>
              <h3 className="font-semibold">Jane M., Student</h3>
            </div>
            <div className="p-6 border rounded-lg">
              <p className="text-gray-600 mb-4">“Creating courses has never been easier. The platform is very intuitive.”</p>
              <h3 className="font-semibold">Mr. Kimani, Teacher</h3>
            </div>
            <div className="p-6 border rounded-lg">
              <p className="text-gray-600 mb-4">“I love the group discussions. They make learning fun and interactive.”</p>
              <h3 className="font-semibold">Samuel K., Student</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA and Footer */}
      <section id="cta" className="py-20 bg-red-500 text-white text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="mb-6">Join thousands of students and teachers already growing together on Edureach.</p>
          <Link to="/signup" className="bg-white text-red-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">Sign Up Now</Link>
        </div>
      </section>

      <footer className="py-10 bg-gray-900 text-white text-center">
        <p>© 2025 Edureach. All Rights Reserved.</p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="#" className="hover:text-red-400">About</a>
          <a href="#" className="hover:text-red-400">Contact</a>
          <a href="#" className="hover:text-red-400">Privacy</a>
        </div>
      </footer>
    </div>
  )
}
