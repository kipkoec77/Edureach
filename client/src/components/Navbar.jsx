import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar(){
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [activeSection, setActiveSection] = useState('')
  const { user, logout } = useAuth()

  const role = user?.role || null
  const dashboardPath = role === 'tutor' ? '/tutor' : role === 'admin' ? '/admin' : '/student'

  useEffect(()=>{
    const ids = ['home','features','how-it-works','testimonials','cta']
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          setActiveSection(entry.target.id)
        }
      })
    },{ root: null, rootMargin: '-120px 0px -50% 0px', threshold: 0.1 })
    ids.forEach(id=>{ const el = document.getElementById(id); if(el) observer.observe(el) })
    return ()=> observer.disconnect()
  },[])

  function doScroll(id){
    const el = document.getElementById(id)
    if(!el) return
    const headerOffset = 80
    const elementPosition = el.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - headerOffset
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
  }

  function handleScroll(id){
    setMobileOpen(false)
    if(location.pathname !== '/'){
      navigate('/')
      // wait for navigation then scroll
      setTimeout(()=> doScroll(id), 200)
    } else {
      doScroll(id)
    }
  }

  const innerClass = location.pathname.startsWith('/tutor') || location.pathname.startsWith('/admin')
    ? 'w-full flex items-center justify-between px-6 py-4'
    : 'max-w-7xl mx-auto flex items-center justify-between px-6 py-4'

  return (
    <header className="w-full fixed top-0 left-0 bg-gray-900/80 backdrop-blur-md z-50 shadow-lg">
      <div className={innerClass}>
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to="/" className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-[0_0_10px_#4F46E5] font-sans tracking-tight">Edureach</Link>
              <nav className="hidden md:flex gap-10 font-medium text-gray-200">
                <button onClick={() => { setMobileOpen(false); if(location.pathname !== '/') { navigate('/') } else { window.scrollTo({ top: 0, behavior: 'smooth' }) } }} className="relative hover:text-white transition duration-300 px-1">
                  Home
                  <span className={`absolute left-0 -bottom-2 h-0.5 bg-blue-400 transition-all ${activeSection==='home' ? 'w-full' : 'w-0'}`} />
                </button>
                <button onClick={()=>handleScroll('features')} className="relative hover:text-white transition duration-300 px-1">
                  Features
                  <span className={`absolute left-0 -bottom-2 h-0.5 bg-blue-400 transition-all ${activeSection==='features' ? 'w-full' : 'w-0'}`} />
                </button>
                <button onClick={()=>handleScroll('how-it-works')} className="relative hover:text-white transition duration-300 px-1">
                  How It Works
                  <span className={`absolute left-0 -bottom-2 h-0.5 bg-blue-400 transition-all ${activeSection==='how-it-works' ? 'w-full' : 'w-0'}`} />
                </button>
                <button onClick={()=>handleScroll('testimonials')} className="relative hover:text-white transition duration-300 px-1">
                  Testimonials
                  <span className={`absolute left-0 -bottom-2 h-0.5 bg-blue-400 transition-all ${activeSection==='testimonials' ? 'w-full' : 'w-0'}`} />
                </button>
                
                <button onClick={()=>handleScroll('cta')} className="relative hover:text-white transition duration-300 px-1">
                  Get Started
                  <span className={`absolute left-0 -bottom-2 h-0.5 bg-blue-400 transition-all ${activeSection==='cta' ? 'w-full' : 'w-0'}`} />
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* CTA or auth links */}
              <div className="hidden md:block">
                {!user ? (
                  <div className="flex items-center gap-3">
                    <Link to="/login" className="bg-transparent hover:bg-white/5 text-white px-4 py-2 rounded-md">Sign in</Link>
                    <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-lg transition font-semibold">Sign up</Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link to={dashboardPath} className="text-gray-200 hover:text-white px-4 py-2 rounded-md transition">
                      Dashboard
                    </Link>
                    <span className="text-gray-200 text-sm">{user?.name}</span>
                    <button onClick={logout} className="text-gray-200 hover:text-white px-4 py-2 rounded-md transition">
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <div className="md:hidden">
                <button type="button" onClick={()=>setMobileOpen(v=>!v)} aria-expanded={mobileOpen} aria-controls="mobile-menu" className="text-gray-200 focus:outline-none">
                  <span className="sr-only">Open mobile menu</span>
                  {!mobileOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      <div className={`${mobileOpen ? 'block' : 'hidden'} md:hidden bg-gray-900/95 backdrop-blur-md`} id="mobile-menu">
        <nav className="flex flex-col gap-4 px-6 py-4 text-gray-200 font-medium">
          <button onClick={()=>{ setMobileOpen(false); if(location.pathname !== '/') { navigate('/') } else { window.scrollTo({ top: 0, behavior: 'smooth' }) } }} className="text-left hover:text-white transition">Home</button>
          <button onClick={()=>handleScroll('features')} className="text-left hover:text-white transition">Features</button>
          <button onClick={()=>handleScroll('how-it-works')} className="text-left hover:text-white transition">How It Works</button>
          <button onClick={()=>handleScroll('testimonials')} className="text-left hover:text-white transition">Testimonials</button>
          
          <button onClick={()=>handleScroll('cta')} className="text-left hover:text-white transition">Get Started</button>
          <div className="mt-2">
            {!user ? (
              <div className="flex flex-col gap-2">
                <Link to="/signup" onClick={()=>setMobileOpen(false)} className="text-left hover:text-white transition">Register</Link>
                <Link to="/login" onClick={()=>setMobileOpen(false)} className="text-left hover:text-white transition">Login</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-gray-200 text-sm">{user?.name}</span>
                <Link to={dashboardPath} onClick={()=>setMobileOpen(false)} className="text-left hover:text-white transition">
                  Dashboard
                </Link>
                <button onClick={()=>{ logout(); setMobileOpen(false); }} className="text-left hover:text-white transition">
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
