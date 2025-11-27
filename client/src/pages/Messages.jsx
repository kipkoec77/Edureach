import React, { useState } from 'react'
import TutorSidebar from '../components/TutorSidebar'
import TutorNavbar from '../components/TutorNavbar'
import { sampleMessages } from '../data/tutorData'

export default function Messages(){
  const [conversations] = useState(sampleMessages)
  const [active, setActive] = useState(conversations[0])
  const [text, setText] = useState('')

  const send = ()=>{
    if (!text) return
    // mock send
    active.messages.push({ from: 'You', text, time: 'now' })
    setText('')
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full px-6">
        <div className="md:col-span-1 w-full"><TutorSidebar/></div>
        <div className="md:col-span-3 space-y-6 w-full">
          <TutorNavbar/>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1 border-r pr-3">
                <ul className="space-y-2">
                  {conversations.map(c=> (
                    <li key={c.id} className={`p-2 rounded hover:bg-gray-50 cursor-pointer ${active.id===c.id? 'bg-gray-100':''}`} onClick={()=>setActive(c)}>
                      <div className="font-medium">{c.from}</div>
                      <div className="text-xs text-gray-400">{c.preview} • {c.time}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-3">
                <div className="h-72 overflow-auto space-y-3 p-3">
                  {active.messages.map((m,i)=> (
                    <div key={i} className={`p-2 rounded ${m.from==='You'? 'bg-blue-50 ml-auto text-right':'bg-gray-100'}`} style={{maxWidth: '70%'}}>
                      <div className="text-sm">{m.text}</div>
                      <div className="text-xs text-gray-400 mt-1">{m.time}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 border p-2 rounded" placeholder="Write a message" />
                  <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
