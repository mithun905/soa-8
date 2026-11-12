import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { authApi } from '../services/api.js'

export default function AdminProfile() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const empty = { name: '', email: '', password: '' }
  const [form, setForm] = useState(empty)
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  const create = async (e) => {
    e.preventDefault(); setMsg(null); setBusy(true)
    try {
      const u = await authApi.createAdmin(form)
      setMsg({ type: 'success', text: `Admin account created for ${u.email}` })
      setForm(empty)
    } catch (err) {
      const detail = Object.values(err.fieldErrors || {})[0]
      setMsg({ type: 'error', text: detail || err.message })
    } finally { setBusy(false) }
  }

  return (
    <>
      <div className="card">
        <h2>My Profile</h2>
        <dl className="profile">
          <dt>Name</dt><dd>{user.name}</dd>
          <dt>Email</dt><dd>{user.email}</dd>
        </dl>
        <button className="btn danger" onClick={() => { logout(); nav('/admin/login') }}>Logout</button>
      </div>

      <form className="card" onSubmit={create}>
        <h2>Create another admin account</h2>
        <p className="muted">Only existing admins can create admin accounts.</p>
        {msg && <div className={`alert ${msg.type}`}>{msg.text}</div>}
        <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Temporary password<input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button className="btn primary" disabled={busy}>{busy ? 'Creating…' : 'Create admin'}</button>
      </form>
    </>
  )
}
