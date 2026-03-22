import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'

const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Notices = lazy(() => import('./pages/Notices'))
const Blog = lazy(() => import('./pages/Blog'))
const Courses = lazy(() => import('./pages/Courses'))
const Team = lazy(() => import('./pages/Team'))
const Leads = lazy(() => import('./pages/Leads'))
const Media = lazy(() => import('./pages/Media'))

import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

const Layout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <main className="flex-1 ml-64 p-8 min-h-screen relative">{children}</main>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute><Layout><Navigate to="/dashboard" replace /></Layout></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/notices" element={<ProtectedRoute><Layout><Notices /></Layout></ProtectedRoute>} />
          <Route path="/blog" element={<ProtectedRoute><Layout><Blog /></Layout></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><Layout><Courses /></Layout></ProtectedRoute>} />
          <Route path="/team" element={<ProtectedRoute><Layout><Team /></Layout></ProtectedRoute>} />
          <Route path="/leads" element={<ProtectedRoute><Layout><Leads /></Layout></ProtectedRoute>} />
          <Route path="/media" element={<ProtectedRoute><Layout><Media /></Layout></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
