import React from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AuthHeader from '../components/AuthHeader'
import Footer from '../components/Footer'

export default function MainLayout({ children }){
  const { pathname } = useLocation()

  // For the landing page we want full-bleed content (no max-width container).
  // Make tutor pages full-bleed so dashboard components can stretch edge-to-edge.
  const fullBleed = pathname === '/' || pathname.startsWith('/tutor') || pathname.startsWith('/admin') || pathname.startsWith('/student')
  const containerClass = fullBleed
    ? 'flex-1 w-full px-4 py-8 pt-20'
    : 'flex-1 max-w-6xl mx-auto px-4 py-8 w-full pt-20'

  const showMarketingNavbar = !pathname.startsWith('/student')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showMarketingNavbar && <Navbar />}
      {!pathname.startsWith('/student') && <AuthHeader />}
      <div className={containerClass}>{children}</div>
      <Footer />
    </div>
  )
}
