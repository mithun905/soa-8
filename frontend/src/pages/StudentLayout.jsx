import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

export default function StudentLayout() {
  return (
    <div className="shell student">
      <Navbar variant="student" links={[{ to: '/student', label: 'Home' }, { to: '/student/profile', label: 'Profile' }]} />
      <main className="content"><Outlet /></main>
    </div>
  )
}
