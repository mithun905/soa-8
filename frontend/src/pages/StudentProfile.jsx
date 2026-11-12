
import { useEffect, useState } from 'react'
import { complaintApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function StudentProfile() {
  const { user } = useAuth()

  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadComplaints()
  }, [])

  async function loadComplaints() {
    try {
      setLoading(true)
      const data = await complaintApi.getStudentComplaints()
      setComplaints(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const statusColor = {
    NOT_STARTED: '#dc2626',
    IN_PROGRESS: '#ea580c',
    COMPLETED: '#16a34a'
  }

  return (
    <div style={{ maxWidth: 1000, margin: '30px auto', padding: 20 }}>

      <h1>My Profile</h1>

      <div style={{
        background: 'white',
        padding: 20,
        borderRadius: 12,
        border: '1px solid #ddd'
      }}>
        <h2>Student Details</h2>
        <p><b>Name:</b> {user?.name}</p>
        <p><b>Email:</b> {user?.email}</p>
        <p><b>Roll Number:</b> {user?.rollNumber}</p>
        <p><b>Role:</b> {user?.role}</p>
      </div>

      <h2 style={{ marginTop: 30 }}>My Complaint History</h2>
      <p>Track all your submitted campus complaints.</p>

      <button onClick={loadComplaints}>Refresh</button>

      {loading && <p>Loading complaints...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && complaints.length === 0 && (
        <p>You haven't submitted any complaints yet.</p>
      )}

      {complaints.map(c => (
        <div key={c.id} style={{
          border: '1px solid #ddd',
          borderRadius: 12,
          padding: 20,
          marginTop: 20,
          background: 'white'
        }}>
          <h3>{c.category}</h3>
          <p>{c.description}</p>

          <p>
            <b>Status: </b>
            <span style={{
              color: statusColor[c.status] || '#333',
              fontWeight: 'bold'
            }}>
              {c.status?.replace('_', ' ')}
            </span>
          </p>

          <p>
            <b>Submitted:</b>{' '}
            {c.createdAt
              ? new Date(c.createdAt).toLocaleString()
              : 'Unavailable'}
          </p>

          {c.photo && (
            <div>
              <p><b>Complaint Photo:</b></p>
              <img src={c.photo} alt="Complaint"
                style={{ maxWidth: 250, maxHeight: 200, objectFit: 'contain' }} />
            </div>
          )}

          {c.adminDescription && (
            <div>
              <h4>Admin Update</h4>
              <p>{c.adminDescription}</p>
            </div>
          )}

          {c.proofPhoto && (
            <div>
              <p><b>Completion Proof:</b></p>
              <img src={c.proofPhoto} alt="Completion proof"
                style={{ maxWidth: 250, maxHeight: 200, objectFit: 'contain' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
