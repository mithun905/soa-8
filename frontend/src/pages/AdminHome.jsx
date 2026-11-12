
import { useEffect, useState } from 'react'
import { complaintApi } from '../services/api'

export default function AdminHome() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState('')

  async function loadComplaints() {
    try {
      setLoading(true)
      const data = await complaintApi.getAll()
      setComplaints(data)
      setError('')
    } catch (err) {
      setError(err.message || 'Unable to load complaints')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComplaints()
  }, [])

  async function updateComplaint(id, status, description, photo) {
    try {
      setSaving(id)

      const formData = new FormData()
      formData.append('status', status)
      formData.append('adminDescription', description)

      if (photo) formData.append('proofPhoto', photo)

      await complaintApi.updateStatus(id, formData)
      await loadComplaints()
      alert('Complaint updated successfully!')
    } catch (err) {
      alert(err.message || 'Failed to update complaint')
    } finally {
      setSaving('')
    }
  }

  const counts = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'NOT_STARTED').length,
    progress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    completed: complaints.filter(c => c.status === 'COMPLETED').length
  }

  const colors = {
    NOT_STARTED: '#dc2626',
    IN_PROGRESS: '#ea580c',
    COMPLETED: '#16a34a'
  }

  return (
    <div style={{ maxWidth: 1100, margin: '30px auto', padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <p>Manage campus maintenance complaints.</p>

      <button onClick={loadComplaints}>Refresh Complaints</button>

      <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap', margin: '20px 0' }}>
        <b>Total: {counts.total}</b>
        <b style={{ color: colors.NOT_STARTED }}>Not Started: {counts.pending}</b>
        <b style={{ color: colors.IN_PROGRESS }}>In Progress: {counts.progress}</b>
        <b style={{ color: colors.COMPLETED }}>Completed: {counts.completed}</b>
      </div>

      {loading && <p>Loading complaints...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && complaints.length === 0 && (
        <p>No complaints received yet.</p>
      )}

      {complaints.map(c => (
        <ComplaintCard
          key={c.id}
          complaint={c}
          colors={colors}
          saving={saving === c.id}
          onUpdate={updateComplaint}
        />
      ))}
    </div>
  )
}

function ComplaintCard({ complaint: c, colors, saving, onUpdate }) {
  const [status, setStatus] = useState(c.status || 'NOT_STARTED')
  const [description, setDescription] = useState(c.adminDescription || '')
  const [photo, setPhoto] = useState(null)

  useEffect(() => {
    setStatus(c.status || 'NOT_STARTED')
    setDescription(c.adminDescription || '')
    setPhoto(null)
  }, [c])

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: 12,
      padding: 20,
      marginTop: 20,
      background: 'white'
    }}>
      <h3>{c.category} Complaint</h3>

      <p><b>Student:</b> {c.studentName}</p>
      <p><b>Email/Student ID:</b> {c.studentId}</p>
      <p><b>Roll Number:</b> {c.rollNumber}</p>
      <p><b>Description:</b> {c.description}</p>
      <p><b>Submitted:</b> {c.createdAt ? new Date(c.createdAt).toLocaleString() : 'Unavailable'}</p>

      {c.photo && (
        <div>
          <p><b>Complaint Photo:</b></p>
          <img src={c.photo} alt="Complaint"
            style={{ maxWidth: 250, maxHeight: 200, objectFit: 'contain' }} />
        </div>
      )}

      <p>
        <b>Current Status: </b>
        <span style={{ color: colors[c.status] || '#333', fontWeight: 'bold' }}>
          {c.status?.replace('_', ' ')}
        </span>
      </p>

      <hr />

      <h4>Update Complaint</h4>

      <label>Status</label>
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        style={{ display: 'block', padding: 10, margin: '10px 0 20px', width: '100%' }}
      >
        <option value="NOT_STARTED">Not Started</option>
        <option value="IN_PROGRESS">In Progress / Assigned</option>
        <option value="COMPLETED">Completed</option>
      </select>

      <label>Admin Work Description</label>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows="3"
        placeholder="Describe the work done or current progress..."
        style={{ display: 'block', width: '100%', padding: 10, boxSizing: 'border-box', margin: '10px 0 20px' }}
      />

      <label>Completion Proof Photo (Optional, max 5MB)</label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={e => setPhoto(e.target.files[0] || null)}
        style={{ display: 'block', margin: '10px 0 20px' }}
      />

      {c.proofPhoto && (
        <div>
          <p><b>Uploaded Completion Proof:</b></p>
          <img src={c.proofPhoto} alt="Completion proof"
            style={{ maxWidth: 250, maxHeight: 200, objectFit: 'contain' }} />
        </div>
      )}

      <button
        disabled={saving}
        onClick={() => {
          if (photo && photo.size > 5 * 1024 * 1024) {
            alert('Image must be below 5MB')
            return
          }

          if (status === 'COMPLETED' &&
              !description.trim() && !photo && !c.proofPhoto) {
            alert('Add a completion description or proof photo')
            return
          }

          onUpdate(c.id, status, description, photo)
        }}
      >
        {saving ? 'Updating...' : 'Save Update'}
      </button>
    </div>
  )
}
