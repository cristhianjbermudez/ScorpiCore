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
          resolve({ status: res.statusCode, data: JSON.parse(body), headers: res.headers })
        } catch {
          resolve({ status: res.statusCode, data: body, headers: res.headers })
        }
      })
    })
    req.on('error', reject)
    if (options.body) req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body))
    req.end()
  })
}

let token = null

describe('Security: Token HMAC', () => {
  it('Old format tokens (plain hex) are rejected', async () => {
    const fakeOldToken = 'a'.repeat(64)
    const res = await request('/api/auth/verify', {
      headers: { Authorization: `Bearer ${fakeOldToken}` },
    })
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.data.valid, false)
  })

  it('Random garbage tokens are rejected', async () => {
    const res = await request('/api/auth/verify', {
      headers: { Authorization: 'Bearer not-a-real-token' },
    })
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.data.valid, false)
  })

  it('Tampered token (modified signature) is rejected', async () => {
    const loginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { username: process.env.ADMIN_USER || 'admin', password: process.env.ADMIN_PASS || 'scorpicore2025' },
    })
    const validToken = loginRes.data.token
    const parts = validToken.split('.')
    const tampered = parts[0] + '.AAAA' + parts[1].slice(4)
    const res = await request('/api/auth/verify', {
      headers: { Authorization: `Bearer ${tampered}` },
    })
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.data.valid, false)
  })

  it('Valid HMAC token is accepted', async () => {
    const loginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { username: process.env.ADMIN_USER || 'admin', password: process.env.ADMIN_PASS || 'scorpicore2025' },
    })
    assert.strictEqual(loginRes.status, 200)
    token = loginRes.data.token
    assert.ok(token.includes('.'), 'Token should have payload.signature format')

    const verifyRes = await request('/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    })
    assert.strictEqual(verifyRes.status, 200)
    assert.strictEqual(verifyRes.data.valid, true)
  })
})

describe('Security: Helmet headers', () => {
  it('Returns X-Content-Type-Options header', async () => {
    const res = await request('/api/health')
    assert.strictEqual(res.headers['x-content-type-options'], 'nosniff')
  })

  it('Returns X-Frame-Options header', async () => {
    const res = await request('/api/health')
    assert.strictEqual(res.headers['x-frame-options'], 'SAMEORIGIN')
  })

  it('Returns Content-Security-Policy header', async () => {
    const res = await request('/api/health')
    assert.ok(res.headers['content-security-policy'], 'CSP header should be present')
  })

  it('Returns Referrer-Policy header', async () => {
    const res = await request('/api/health')
    assert.strictEqual(res.headers['referrer-policy'], 'strict-origin-when-cross-origin')
  })
})

describe('Security: CORS', () => {
  it('Request without Origin header is allowed', async () => {
    const res = await request('/api/services')
    assert.strictEqual(res.status, 200)
  })
})

describe('Security: Path traversal in upload delete', () => {
  it('Rejects filename with .. path traversal', async () => {
    const res = await request('/api/upload/..%2F.env', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    assert.ok(res.status === 400 || res.status === 404, `Expected 400 or 404, got ${res.status}`)
  })

  it('Rejects absolute path filename', async () => {
    const res = await request('/api/upload/C:/Windows/System32/config/sam', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    assert.ok(res.status === 400 || res.status === 404, `Expected 400 or 404, got ${res.status}`)
  })

  it('Rejects just .. as filename', async () => {
    const res = await request('/api/upload/..', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    assert.ok(res.status === 400 || res.status === 404, `Expected 400 or 404, got ${res.status}`)
  })

  it('Rejects . as filename', async () => {
    const res = await request('/api/upload/.', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    assert.ok(res.status === 400 || res.status === 404, `Expected 400 or 404, got ${res.status}`)
  })

  it('Non-existent file returns 404', async () => {
    const res = await request('/api/upload/nonexistent123.jpg', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    assert.strictEqual(res.status, 404)
  })
})

describe('Security: Auth required for admin routes', () => {
  it('POST /api/faqs without auth returns 401', async () => {
    const res = await request('/api/faqs', {
      method: 'POST',
      body: { question: 'test', answer: 'test' },
    })
    assert.strictEqual(res.status, 401)
  })

  it('PUT /api/faqs/1 without auth returns 401', async () => {
    const res = await request('/api/faqs/1', {
      method: 'PUT',
      body: { question: 'test', answer: 'test' },
    })
    assert.strictEqual(res.status, 401)
  })

  it('DELETE /api/faqs/1 without auth returns 401', async () => {
    const res = await request('/api/faqs/1', {
      method: 'DELETE',
    })
    assert.strictEqual(res.status, 401)
  })

  it('PATCH /api/faqs/1/toggle without auth returns 401', async () => {
    const res = await request('/api/faqs/1/toggle?field=visible', {
      method: 'PATCH',
    })
    assert.strictEqual(res.status, 401)
  })

  it('PUT /api/upload/x without auth returns 401', async () => {
    const res = await request('/api/upload/test.jpg', {
      method: 'DELETE',
    })
    assert.strictEqual(res.status, 401)
  })

  it('PUT /api/site-settings/x without auth returns 401', async () => {
    const res = await request('/api/site-settings/test', {
      method: 'PUT',
      body: { content: 'test' },
    })
    assert.strictEqual(res.status, 401)
  })
})

describe('Security: Error messages sanitized', () => {
  it('Invalid table returns controlled error (not DB error)', async () => {
    const res = await request('/api/nonexistent_table_xyz')
    assert.strictEqual(res.status, 403)
    assert.ok(res.data.error.includes('no permitida'))
    assert.ok(!res.data.error.includes('SQL'), 'Should not expose SQL details')
    assert.ok(!res.data.error.includes('mysql'), 'Should not expose MySQL details')
  })

  it('Login missing fields returns 400', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: {},
    })
    assert.strictEqual(res.status, 400)
  })

  it('Login failure does not reveal which field is wrong', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: { username: 'admin', password: 'wrong' },
    })
    assert.strictEqual(res.status, 401)
    assert.strictEqual(res.data.error, 'Credenciales incorrectas')
  })
})

describe('Security: Zod validation', () => {
  it('Service with empty title rejected', async () => {
    const res = await request('/api/services', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { title: '', description: 'test', features: ['a'] },
    })
    assert.strictEqual(res.status, 400)
  })

  it('Service with too-long title rejected', async () => {
    const res = await request('/api/services', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { title: 'x'.repeat(300), description: 'test', features: ['a'] },
    })
    assert.strictEqual(res.status, 400)
  })

  it('Contact with invalid email rejected', async () => {
    const res = await request('/api/contact', {
      method: 'POST',
      body: { name: 'Test', email: 'not-email', description: 'test' },
    })
    assert.strictEqual(res.status, 400)
  })

  it('FAQ with empty question rejected', async () => {
    const res = await request('/api/faqs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { question: '', answer: 'test' },
    })
    assert.strictEqual(res.status, 400)
  })
})

describe('API: Site Settings', () => {
  it('GET /api/site-settings returns object', async () => {
    const res = await request('/api/site-settings')
    assert.strictEqual(res.status, 200)
    assert.strictEqual(typeof res.data, 'object')
  })

  it('GET /api/site-settings?section=hero returns filtered', async () => {
    const res = await request('/api/site-settings?section=hero')
    assert.strictEqual(res.status, 200)
  })
})

describe('API: Messages CRUD', () => {
  let messageId = null

  it('Create a message first via contact form', async () => {
    const res = await request('/api/contact', {
      method: 'POST',
      body: { name: 'Test', email: 'test@test.com', description: 'msg for test' },
    })
    assert.strictEqual(res.status, 200)
    messageId = res.data.id
  })

  it('PUT /api/messages/:id with valid status updates', async () => {
    assert.ok(messageId, 'Need a message ID from previous test')
    const res = await request(`/api/messages/${messageId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: { status: 'leido' },
    })
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.data.status, 'leido')
  })

  it('PUT /api/messages/:id with invalid status returns 400', async () => {
    assert.ok(messageId, 'Need a message ID from previous test')
    const res = await request(`/api/messages/${messageId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: { status: 'invalid_status' },
    })
    assert.strictEqual(res.status, 400)
  })
})

describe('API: Table write protection', () => {
  it('Cannot POST to readonly table site_settings via generic endpoint', async () => {
    const res = await request('/api/site_settings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { section_key: 'test', content: 'test' },
    })
    assert.strictEqual(res.status, 403)
    assert.ok(res.data.error.includes('solo lectura'))
  })

  it('Cannot POST to readonly table seo_settings via generic endpoint', async () => {
    const res = await request('/api/seo_settings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { page_key: 'test', title: 'test' },
    })
    assert.strictEqual(res.status, 403)
    assert.ok(res.data.error.includes('solo lectura'))
  })

  it('Cannot DELETE from readonly table site_settings', async () => {
    const res = await request('/api/site_settings/1', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    assert.strictEqual(res.status, 403)
  })
})

describe('Security: Login logging', () => {
  it('Failed login returns generic message (no user enumeration)', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: { username: 'nonexistent_user', password: 'wrong' },
    })
    assert.strictEqual(res.status, 401)
    assert.strictEqual(res.data.error, 'Credenciales incorrectas')
  })
})
