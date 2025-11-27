export const sampleCourses = [
  { id: 'c1', title: 'Introduction to Algebra', students: 124, status: 'Published', completion: 72, thumbnail: '' },
  { id: 'c2', title: 'React for Beginners', students: 98, status: 'Draft', completion: 34, thumbnail: '' },
  { id: 'c3', title: 'Data Science Basics', students: 210, status: 'Published', completion: 56, thumbnail: '' }
]

export const sampleStudents = [
  { id: 's1', name: 'Amina Khan', course: 'Introduction to Algebra', progress: 82, lastActive: '2025-11-18' },
  { id: 's2', name: 'Brian Kim', course: 'React for Beginners', progress: 45, lastActive: '2025-11-17' },
  { id: 's3', name: 'Carla Rossi', course: 'Data Science Basics', progress: 67, lastActive: '2025-11-19' }
]

export const sampleMessages = [
  { id: 'm1', from: 'Amina Khan', preview: 'Question about lesson 3', time: '2h', messages: [
    { from: 'Amina', text: 'Hi, quick q about problem 2', time: '2h' },
    { from: 'You', text: 'Sure — the trick is to...', time: '1h' }
  ]},
  { id: 'm2', from: 'Brian Kim', preview: 'Issue with video', time: '1d', messages: [] }
]

export const sampleContent = [
  { id: 'f1', title: 'Algebra Lecture 1', type: 'video', usedIn: ['Introduction to Algebra'] },
  { id: 'f2', title: 'React Slides', type: 'pdf', usedIn: ['React for Beginners'] }
]
