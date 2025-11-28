import React, { useEffect, useState } from 'react'
import { API_ORIGIN } from '../services/api'

export default function ApiStatusBadge(){
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()
    async function check(){
      try {
        const res = await fetch(`${API_ORIGIN}/`, { signal: controller.signal })
        if (!mounted) return
        if (res.ok) setStatus('online')
        else setStatus('degraded')
      } catch (e){
        if (!mounted) return
        setStatus('offline')
      }
    }
    check()
    const id = setInterval(check, 30000)
    return () => { mounted = false; controller.abort(); clearInterval(id) }
  }, [])

  if (status === 'checking') {
    return <span className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">Checking API…</span>
  }
  if (status === 'online') {
    return <span className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded bg-green-100 text-green-700">API Online</span>
  }
  if (status === 'degraded') {
    return <span className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">API Degraded</span>
  }
  return <span className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded bg-red-100 text-red-700">API Offline</span>
}
