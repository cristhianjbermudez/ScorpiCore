const API_BASE = import.meta.env.VITE_API_URL || '/api'

function getToken() {
  return localStorage.getItem('scorpicore_token')
}

function setToken(token) {
  localStorage.setItem('scorpicore_token', token)
}

function clearToken() {
  localStorage.removeItem('scorpicore_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error del servidor' }))
    if (res.status === 401 && getToken()) {
      clearToken()
      throw new Error('Sesión expirada. Inicia sesión de nuevo.')
    }
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  login: async (username, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    if (data.token) setToken(data.token)
    return data
  },
  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' })
    } catch {
      // Logout best-effort
    }
    clearToken()
  },
  verify: () => request('/auth/verify'),
  isAuthenticated: () => !!getToken(),

  getAll: (table, params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/${table}${qs ? '?' + qs : ''}`)
  },
  get: (table, id) => request(`/${table}/${id}`),
  create: (table, data) => request(`/${table}`, { method: 'POST', body: JSON.stringify(data) }),
  update: (table, id, data) =>
    request(`/${table}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (table, id) => request(`/${table}/${id}`, { method: 'DELETE' }),
  toggle: (table, id, field = 'visible') =>
    request(`/${table}/${id}/toggle?field=${field}`, { method: 'PATCH' }),
  contact: (data) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),
  updateMessage: (id, data) =>
    request(`/messages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getSettings: (section) => {
    const qs = section ? `?section=${section}` : ''
    return request(`/site-settings${qs}`)
  },
  saveSetting: (key, content) =>
    request(`/site-settings/${key}`, { method: 'PUT', body: JSON.stringify({ content }) }),

  upload: async (file) => {
    const token = getToken()
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
    if (res.status === 401) {
      clearToken()
      throw new Error('Sesión expirada.')
    }
    if (!res.ok) {
      const e = await res.json().catch(() => ({}))
      throw new Error(e.error || 'Error al subir')
    }
    return res.json()
  },
  deleteFile: (filename) => request(`/upload/${filename}`, { method: 'DELETE' }),
}
