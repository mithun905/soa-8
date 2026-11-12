import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { homeFor } from '../components/ProtectedRoute.jsx'

/** Used for both portals: portal = 'STUDENT' | 'ADMIN' */
export default function Login({ portal }) {
  const isAdmin = portal === 'ADMIN'
  const { user, login } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={homeFor(user)} replace />

  const submit = async (e) => {
    e.preventDefault(); setError(''); setBusy(true)
    try {
      const u = await login(form.email, form.password, portal)
      nav(homeFor(u), { replace: true })
    } catch (err) {
      setError(err.message)
    } finally { setBusy(false) }
  }

  return (
    <div className={`auth-page ${isAdmin ? 'admin' : 'student'}`}>
      <form className="auth-card" onSubmit={submit}>
        <h1>{isAdmin ? 'Admin (Faculty) Login' : 'Student Login'}</h1>
        <p className="muted">{isAdmin ? 'Manage and resolve campus complaints' : 'Report and track campus issues'}</p>
        {error && <div className="alert error">{error}</div>}
        <label>Email
          <input type="email" required autoComplete="email" value={form.email}
                 onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>Password
          <input type="password" required autoComplete="current-password" value={form.password}
                 onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <button className="btn primary" disabled={busy}>{busy ? 'Signing in…' : 'Login'}</button>
        <div className="auth-links">
          {isAdmin
            ? <Link to="/login">Student login →</Link>
            : <><Link to="/register">Create student account</Link><Link to="/admin/login">Admin login →</Link></>}
        </div>
      </form>
    </div>
  )
}
