import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import TutorApplication from './pages/TutorApplication'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Register from './pages/Register'
import DashboardStudent from './pages/DashboardStudent'
import StudentCourses from './pages/StudentCourses'
import LearnCourse from './pages/LearnCourse'
import DashboardTutor from './pages/DashboardTutor'
import MyCourses from './pages/MyCourses'
import CreateCourse from './pages/CreateCourse'
import Students from './pages/Students'
import BrowseCourses from './pages/BrowseCourses'
import Announcements from './pages/Announcements'
import Messages from './pages/Messages'
import ContentLibrary from './pages/ContentLibrary'
import Settings from './pages/Settings'
import DashboardAdmin from './pages/DashboardAdmin'
import TutorCourse from './pages/TutorCourse'
import StudentAttendance from './pages/StudentAttendance'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/courses" element={<Courses/>} />
        <Route path="/courses/:id" element={<CourseDetails/>} />
        <Route path="/apply" element={<TutorApplication/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/register" element={<Register/>} />

        <Route path="/student" element={<ProtectedRoute><DashboardStudent/></ProtectedRoute>} />
        <Route path="/student/courses" element={<ProtectedRoute><StudentCourses/></ProtectedRoute>} />
        <Route path="/courses/:id/learn" element={<ProtectedRoute><LearnCourse/></ProtectedRoute>} />
        <Route path="/student/browse" element={<ProtectedRoute><BrowseCourses/></ProtectedRoute>} />
        <Route path="/student/attendance" element={<ProtectedRoute><StudentAttendance/></ProtectedRoute>} />
        <Route path="/tutor" element={<ProtectedRoute roles={["tutor"]}><DashboardTutor/></ProtectedRoute>} />
        <Route path="/tutor/courses" element={<ProtectedRoute roles={["tutor"]}><MyCourses/></ProtectedRoute>} />
        <Route path="/tutor/courses/create" element={<ProtectedRoute roles={["tutor"]}><CreateCourse/></ProtectedRoute>} />
        <Route path="/tutor/students" element={<ProtectedRoute roles={["tutor"]}><Students/></ProtectedRoute>} />
        <Route path="/tutor/announcements" element={<ProtectedRoute roles={["tutor"]}><Announcements/></ProtectedRoute>} />
        <Route path="/tutor/messages" element={<ProtectedRoute roles={["tutor"]}><Messages/></ProtectedRoute>} />
        <Route path="/tutor/library" element={<ProtectedRoute roles={["tutor"]}><ContentLibrary/></ProtectedRoute>} />
        <Route path="/tutor/settings" element={<ProtectedRoute roles={["tutor"]}><Settings/></ProtectedRoute>} />
        <Route path="/tutor/course/:id" element={<ProtectedRoute roles={["tutor"]}><TutorCourse/></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><DashboardAdmin/></ProtectedRoute>} />
      </Routes>
    </MainLayout>
  )
}
