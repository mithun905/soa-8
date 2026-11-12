import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

export default function AdminLayout() {
  return (
    <div className="shell admin">
      <Navbar variant="admin" links={[
        { to: '/admin', label: 'Dashboard' },
        { to: '/admin/complaints', label: 'All Complaints' },
        { to: '/admin/profile', label: 'Profile' },
      ]} />
      <main className="content"><Outlet /></main>
    </div>
  )
}
