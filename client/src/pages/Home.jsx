import React from 'react'
import { Link } from 'react-router-dom'
import ApiStatusBadge from '../components/ApiStatusBadge'

const TAGLINES = [
  'Where Ambition Meets Opportunity.',
  'Knowledge That Builds Careers.',
  'Learn. Grow. Succeed.',
  'Future-Ready Skills for a Digital World.',
]

const CATEGORIES = [
  'Technology & Programming',
  'Business & Entrepreneurship',
  'Academic Subjects',
  'Creative Skills',
  'Personal Development',
]

export default function Home(){
  const tagline = TAGLINES[2] // default: Simple & Strong
  return (
    <div className="w-full">
      {/* Hero */}
      <main className="w-full relative bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">EduReach</p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                EduReach – Learn Without Limits
              </h1>
              <p className="mt-5 text-lg text-gray-700 leading-relaxed max-w-2xl">
                Empowering learners with the skills, knowledge, and confidence to shape their future. Explore expert-led courses, practical tutorials, and real-world learning paths designed to meet today’s opportunities. Whether you're a student, professional, or lifelong learner, EduReach gives you everything you need to grow.
              </p>
              <p className="mt-4 italic text-gray-800">{tagline}</p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center">
                <Link to="/signup" className="inline-flex flex-col items-center sm:items-start bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition">
                  <span className="font-semibold">Register Now</span>
                  <span className="text-xs text-indigo-100">Start learning in minutes</span>
                </Link>
                <Link to="/about" className="inline-flex flex-col items-center sm:items-start bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg border border-gray-200 transition">
                  <span className="font-semibold">Learn More</span>
                  <span className="text-xs text-gray-500">See how EduReach works</span>
                </Link>
              </div>

              <div className="mt-5 flex items-center gap-4 text-sm text-gray-600">
                <span>🔥 Trusted by 10,000+ learners worldwide</span>
                <ApiStatusBadge />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-pink-200 rounded-full blur-2xl opacity-60"/>
              <div className="absolute -bottom-8 -left-10 w-56 h-56 bg-indigo-200 rounded-full blur-2xl opacity-60"/>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Learner studying online"
                loading="lazy"
                className="relative rounded-2xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Why EduReach */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why EduReach?</h2>
          <p className="mt-4 text-gray-700 leading-relaxed max-w-3xl">
            Learning shouldn’t be complicated. EduReach gives you simple access to high-quality courses created by professionals across different fields. Every lesson, quiz, and module is designed to boost your confidence and sharpen your skills.
          </p>
        </div>
      </section>

      {/* Explore Courses */}
      <section className="py-16 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">Explore Courses Made for You</h3>
          <p className="mt-3 text-gray-700 max-w-3xl">
            Whether you want to master tech, improve academic performance, or gain practical life skills, EduReach offers structured learning paths that make learning enjoyable and effective.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((c) => (
              <div key={c} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
                <h4 className="font-semibold text-gray-900">{c}</h4>
                <p className="text-sm text-gray-600 mt-2">Curated lessons, practice, and assessments.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learn at Your Own Pace */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">Learn at Your Own Pace</h3>
            <p className="mt-3 text-gray-700">
              Study anywhere, anytime. Rewatch lessons, pause when needed, and complete assessments at your speed. Your progress syncs across devices—so your learning fits your lifestyle.
            </p>
            <ul className="mt-6 space-y-2 text-gray-700">
              <li>• Self-paced modules and quizzes</li>
              <li>• Mobile-friendly learning</li>
              <li>• Progress sync across devices</li>
            </ul>
          </div>
          <div className="p-6 bg-gray-50 border rounded-xl">
            <h4 className="font-semibold text-gray-900">Track Your Growth</h4>
            <p className="mt-2 text-gray-700">Dashboards, progress reports, and certificates to help you measure how far you’ve come and motivate you to go further.</p>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white border rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">92%</div>
                <div className="text-xs text-gray-500">Complete rate</div>
              </div>
              <div className="p-4 bg-white border rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">10k+</div>
                <div className="text-xs text-gray-500">Learners</div>
              </div>
              <div className="p-4 bg-white border rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">4.8★</div>
                <div className="text-xs text-gray-500">Avg. rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="py-16 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">Join a Global Community</h3>
            <p className="mt-3 text-gray-700">You’re not just learning—you’re connecting. Discuss topics, ask questions, and grow with thousands of learners across the world.</p>
          </div>
          <div className="text-gray-700">
            <div className="p-6 bg-white border rounded-xl shadow-sm">
              <p className="italic">“EduReach keeps me inspired and consistent. The community and structure are amazing.”</p>
              <div className="mt-3 text-sm text-gray-600">— A happy learner</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600">🔥 Trusted by <span className="font-semibold text-gray-900">10,000+ learners</span> worldwide</p>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="py-20 bg-indigo-600 text-white text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin?</h2>
          <p className="mb-6 text-indigo-100">Choose your path. Start your learning journey today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="inline-flex flex-col items-center sm:items-start bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
              <span>Register Now</span>
              <span className="text-xs text-indigo-500">Your future starts here</span>
            </Link>
            <Link to="/about" className="inline-flex flex-col items-center sm:items-start bg-indigo-500 hover:bg-indigo-500/90 text-white px-8 py-3 rounded-lg font-semibold">
              <span>Learn More</span>
              <span className="text-xs text-indigo-100">See how EduReach can transform your learning</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-10 bg-gray-900 text-white text-center">
        <p>© 2025 EduReach. All Rights Reserved.</p>
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <a href="#" className="hover:text-indigo-300">About</a>
          <a href="#" className="hover:text-indigo-300">Contact</a>
          <a href="#" className="hover:text-indigo-300">Privacy</a>
        </div>
      </footer>
    </div>
  )
}
