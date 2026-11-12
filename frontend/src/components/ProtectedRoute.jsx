import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Spinner from './Spinner.jsx'

export const homeFor = (user) => (user.role === 'ADMIN' ? '/admin' : '/student')

/** role: 'STUDENT' | 'ADMIN'. Wrong-role users are redirected to their own dashboard. */
export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner full />
  if (!user) return <Navigate to={role === 'ADMIN' ? '/admin/login' : '/login'} replace />
  if (user.role !== role) return <Navigate to={homeFor(user)} replace />
  return children
}
