import React from 'react'

export default function Quiz({ questions = [], onComplete }){
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card-md">
      <h3 className="text-lg font-semibold">Quiz</h3>
      <div className="mt-4 space-y-4">
        {questions.length === 0 && <div className="text-sm text-gray-500">No questions available</div>}
        {questions.map((q, idx) => (
          <div key={idx} className="p-4 border rounded-lg">
            <div className="font-medium">{idx+1}. {q.question}</div>
            <div className="mt-2 grid grid-cols-1 gap-2">
              {(q.options||[]).map((o,i)=> (
                <label key={i} className="flex items-center gap-3">
                  <input type="radio" name={`q-${idx}`} />
                  <span className="text-sm">{o}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button className="btn-primary" onClick={onComplete}>Submit</button>
      </div>
    </div>
  )
}
