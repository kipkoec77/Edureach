import React from 'react'

export default function DashboardHeader({ title='Dashboard', actions }){
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="text-sm text-text-muted">Welcome back — continue your learning</div>
      </div>
      <div className="flex items-center gap-3">
        {actions}
      </div>
    </header>
  )
}
