const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
const TOKEN_KEY = 'ccms_token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  constructor(message, status, fieldErrors) {
    super(message); this.status = status; this.fieldErrors = fieldErrors || {}
  }
}

let onUnauthorized = () => {}
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn }

/** body: plain object (sent as JSON) or FormData (used for image uploads in later phases) */
export async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {}
  const token = tokenStore.get()
  if (auth && token) headers.Authorization = `Bearer ${token}`
  let payload
  if (body instanceof FormData) payload = body
  else if (body !== undefined) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body) }

  let res
  try {
    res = await fetch(`${API}${path}`, { method, headers, body: payload })
  } catch {
    throw new ApiError('Cannot reach the server. Is the backend running?', 0)
  }
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    if (res.status === 401 && auth) onUnauthorized()
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status, data?.fieldErrors)
  }
  return data
}

export const authApi = {
  login: (email, password, portal) => request('/auth/login', { method: 'POST', auth: false, body: { email, password, portal } }),
  register: (f) => request('/auth/register', { method: 'POST', auth: false, body: f }),
  me: () => request('/auth/me'),
  createAdmin: (f) => request('/admin/users', { method: 'POST', body: f }),
}

export const complaintApi = {
  create: (formData) =>
    request('/student/complaints', {
      method: 'POST',
      body: formData,
    }),

  getStudentComplaints: () =>
    request('/student/complaints'),

  getAll: () =>
    request('/admin/complaints'),

  updateStatus: (id, formData) =>
    request(`/admin/complaints/${id}/status`, {
      method: 'PATCH',
      body: formData,
    }),
}
