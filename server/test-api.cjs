const { describe, it, before, after } = require('node:test')
const assert = require('node:assert')
const http = require('http')

const BASE = 'http://localhost:3001'

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE)
    const req = http.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    }, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) })
        } catch {
          resolve({ status: res.statusCode, data: body })
        }
      })
    })
    req.on('error', reject)
    if (options.body) req.write(JSON.stringify(options.body))
    req.end()
  })
}

describe('API Health', () => {
  it('GET /api/health returns ok', async () => {
    const res = await request('/api/health')
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.data.status, 'ok')
    assert.strictEqual(res.data.database, 'connected')
  })
})

describe('Auth', () => {
  let token = null

  it('POST /api/auth/login with wrong credentials returns 401', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: { username: 'wrong', password: 'wrong' },
    })
    assert.strictEqual(res.status, 401)
  })

  it('POST /api/auth/login with correct credentials returns token', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: { username: process.env.ADMIN_USER || 'admin', password: process.env.ADMIN_PASS || 'scorpicore2025' },
    })
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.data.success, true)
    assert.ok(res.data.token)
    token = res.data.token
  })

  it('GET /api/auth/verify with valid token returns valid', async () => {
    const res = await request('/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    })
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.data.valid, true)
  })

  it('GET /api/auth/verify without token returns invalid', async () => {
    const res = await request('/api/auth/verify')
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.data.valid, false)
  })
})

describe('Public API', () => {
  it('GET /api/services returns array', async () => {
    const res = await request('/api/services')
    assert.strictEqual(res.status, 200)
    assert.ok(Array.isArray(res.data))
    assert.ok(res.data.length > 0)
  })

  it('GET /api/plans returns array', async () => {
    const res = await request('/api/plans')
    assert.strictEqual(res.status, 200)
    assert.ok(Array.isArray(res.data))
  })

  it('GET /api/faqs returns array', async () => {
    const res = await request('/api/faqs')
    assert.strictEqual(res.status, 200)
    assert.ok(Array.isArray(res.data))
  })

  it('GET /api/invalid_table returns 403', async () => {
    const res = await request('/api/evil_table')
    assert.strictEqual(res.status, 403)
  })
})

describe('Contact Form', () => {
  it('POST /api/contact with valid data returns success', async () => {
    const res = await request('/api/contact', {
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        description: 'Test message from automated test',
      },
    })
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.data.success, true)
    assert.ok(res.data.id)
  })

  it('POST /api/contact with missing fields returns 400', async () => {
    const res = await request('/api/contact', {
      method: 'POST',
      body: { name: 'Test' },
    })
    assert.strictEqual(res.status, 400)
  })

  it('POST /api/contact with invalid email returns 400', async () => {
    const res = await request('/api/contact', {
      method: 'POST',
      body: {
        name: 'Test',
        email: 'not-an-email',
        description: 'Test',
      },
    })
    assert.strictEqual(res.status, 400)
  })
})

describe('Admin API (authenticated)', () => {
  let token = null

  before(async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: { username: process.env.ADMIN_USER || 'admin', password: process.env.ADMIN_PASS || 'scorpicore2025' },
    })
    token = res.data.token
  })

  it('GET /api/services without auth returns 401 for single item', async () => {
    const res = await request('/api/services/1')
    assert.strictEqual(res.status, 401)
  })

  it('POST /api/faqs with auth creates item', async () => {
    const res = await request('/api/faqs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        question: 'Test question?',
        answer: 'Test answer.',
      },
    })
    assert.strictEqual(res.status, 200)
    assert.ok(res.data.id)
  })

  it('PATCH /api/faqs/:id/toggle toggles visibility', async () => {
    const createRes = await request('/api/faqs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { question: 'Toggle test?', answer: 'Toggle answer.' },
    })
    const id = createRes.data.id

    const toggleRes = await request(`/api/faqs/${id}/toggle?field=visible`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
    assert.strictEqual(toggleRes.status, 200)
    assert.strictEqual(toggleRes.data.visible, 0)
  })

  it('DELETE /api/faqs/:id soft deletes (sets visible=0)', async () => {
    const createRes = await request('/api/faqs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { question: 'Delete test?', answer: 'Delete answer.' },
    })
    const id = createRes.data.id

    const deleteRes = await request(`/api/faqs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    assert.strictEqual(deleteRes.status, 200)
    assert.strictEqual(deleteRes.data.success, true)
  })
})
