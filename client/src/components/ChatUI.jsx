import React, { useState } from 'react'

export default function ChatUI(){
  const [messages, setMessages] = useState([
    { id:1, from:'tutor', text:'Hi — how can I help you today?'}
  ])
  const [text, setText] = useState('')

  const send = (e)=>{
    e.preventDefault()
    if(!text.trim()) return
    setMessages(m => [...m, { id:Date.now(), from:'me', text }])
    setText('')
  }

  return (
    <div className="flex flex-col h-full border rounded-2xl bg-white p-3 shadow-card-md">
      <div className="flex-1 overflow-auto p-2 space-y-3">
        {messages.map(m=> (
          <div key={m.id} className={`max-w-[80%] ${m.from==='me' ? 'ml-auto bg-primary/10 text-text-main':'bg-gray-100 text-gray-800'} px-3 py-2 rounded-lg`}>{m.text}</div>
        ))}
      </div>
      <form onSubmit={send} className="mt-2 flex items-center gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} className="form-input flex-1 px-4" placeholder="Write a message" />
        <button className="btn-primary">Send</button>
      </form>
    </div>
  )
}
