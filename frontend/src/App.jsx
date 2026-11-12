import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import StudentLayout from './pages/StudentLayout.jsx'
import StudentHome from './pages/StudentHome.jsx'
import StudentProfile from './pages/StudentProfile.jsx'
import AdminLayout from './pages/AdminLayout.jsx'
import AdminHome from './pages/AdminHome.jsx'
import AdminProfile from './pages/AdminProfile.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login portal="STUDENT" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<Login portal="ADMIN" />} />

      <Route path="/student" element={<ProtectedRoute role="STUDENT"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<StudentHome />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminHome />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
