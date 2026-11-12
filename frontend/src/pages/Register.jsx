import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { homeFor } from '../components/ProtectedRoute.jsx'

export default function Register() {
  const { user, register } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', rollNumber: '' })
  const [error, setError] = useState('')
  const [fields, setFields] = useState({})
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={homeFor(user)} replace />
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault(); setError(''); setFields({}); setBusy(true)
    try {
      await register(form)
      nav('/student', { replace: true })
    } catch (err) {
      setError(err.message); setFields(err.fieldErrors || {})
    } finally { setBusy(false) }
  }

  const Field = ({ k, label, type = 'text', ...rest }) => (
    <label>{label}
      <input type={type} required value={form[k]} onChange={set(k)} {...rest} />
      {fields[k] && <span className="field-error">{fields[k]}</span>}
    </label>
  )

  return (
    <div className="auth-page student">
      <form className="auth-card" onSubmit={submit}>
        <h1>Student Registration</h1>
        <p className="muted">Create your account to report campus issues</p>
        {error && <div className="alert error">{error}</div>}
        {Field({ k: 'name', label: 'Full name', autoComplete: 'name' })}
        {Field({ k: 'email', label: 'Email', type: 'email', autoComplete: 'email' })}
        {Field({ k: 'rollNumber', label: 'Roll number' })}
        {Field({ k: 'password', label: 'Password (min 8 chars, letters + digits)', type: 'password', autoComplete: 'new-password', minLength: 8 })}
        <button className="btn primary" disabled={busy}>{busy ? 'Creating…' : 'Register'}</button>
        <div className="auth-links"><Link to="/login">Already registered? Login</Link></div>
      </form>
    </div>
  )
}
