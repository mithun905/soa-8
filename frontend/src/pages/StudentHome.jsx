
import { useState } from 'react'
import { complaintApi } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function StudentHome() {
  const navigate = useNavigate()

  const [category, setCategory] = useState('Electrical')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!description.trim()) {
      setError('Please enter a complaint description')
      return
    }

    if (photo && photo.size > 5 * 1024 * 1024) {
      setError('Image must be below 5MB')
      return
    }

    const formData = new FormData()
    formData.append('category', category)
    formData.append('description', description.trim())

    if (photo) formData.append('photo', photo)

    try {
      setLoading(true)
      await complaintApi.create(formData)

      setMessage('Complaint submitted successfully!')
      setDescription('')
      setPhoto(null)
      e.target.reset()
      setCategory('Electrical')
    } catch (err) {
      setError(err.message || 'Failed to submit complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 750, margin: '30px auto', padding: 20 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div>
          <h1>Submit a Complaint</h1>
          <p>Report campus maintenance problems here.</p>
        </div>

        <button onClick={() => navigate('/student/profile')}>
          My Complaint History
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: 25,
        borderRadius: 12,
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
      }}>
        <label>Complaint Category</label>

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{
            display: 'block',
            width: '100%',
            padding: 12,
            margin: '10px 0 20px'
          }}
        >
          <option>Electrical</option>
          <option>Carpenter</option>
          <option>Plumber</option>
          <option>Others</option>
        </select>

        <label>Complaint Description</label>

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe the issue and its location..."
          required
          rows={5}
          style={{
            display: 'block',
            width: '100%',
            padding: 12,
            margin: '10px 0 20px',
            boxSizing: 'border-box'
          }}
        />

        <label>Upload Photo (Optional, max 5MB)</label>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={e => setPhoto(e.target.files[0] || null)}
          style={{ display: 'block', margin: '12px 0 20px' }}
        />

        {photo && (
          <div style={{ marginBottom: 20 }}>
            <p>Selected photo preview:</p>
            <img
              src={URL.createObjectURL(photo)}
              alt="Preview"
              style={{ maxWidth: 220, maxHeight: 180, objectFit: 'contain' }}
            />
          </div>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && (
          <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  )
}
