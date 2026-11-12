import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar({ links, variant }) {
  const { logout } = useAuth()
  const nav = useNavigate()
  const doLogout = () => { logout(); nav(variant === 'admin' ? '/admin/login' : '/login') }
  return (
    <header className={`navbar ${variant}`}>
      <div className="brand">🏫 Campus Care{variant === 'admin' && <span className="tag">Admin</span>}</div>
      <nav>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end className={({ isActive }) => (isActive ? 'active' : '')}>{l.label}</NavLink>
        ))}
        <button className="link-btn" onClick={doLogout}>Logout</button>
      </nav>
    </header>
  )
}
