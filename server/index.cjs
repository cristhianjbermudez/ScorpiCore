require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const path = require('path')
const fs = require('fs')
const mysql = require('mysql2/promise')
const rateLimit = require('express-rate-limit')
const crypto = require('crypto')
const multer = require('multer')
const { z } = require('zod')

const app = express()
const PORT = process.env.PORT || 3001
const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

// ============ STRUCTURED LOGGER ============

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 }

const logger = {
  _log(level, message, meta = {}) {
    if (LOG_LEVELS[level] > LOG_LEVELS[LOG_LEVEL]) return
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta,
    }
    if (level === 'error') console.error(JSON.stringify(entry))
    else if (level === 'warn') console.warn(JSON.stringify(entry))
    else console.log(JSON.stringify(entry))
  },
  error(msg, meta) { this._log('error', msg, meta) },
  warn(msg, meta) { this._log('warn', msg, meta) },
  info(msg, meta) { this._log('info', msg, meta) },
  debug(msg, meta) { this._log('debug', msg, meta) },
}

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    if (!req.path.startsWith('/uploads')) {
      logger.info('request', {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
      })
    }
  })
  next()
})

// ============ SECURITY ============

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: 'Demasiadas peticiones. Intenta de nuevo en 15 minutos.' },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Demasiados intentos de login.' },
})

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados mensajes. Intenta de nuevo más tarde.' },
})

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Demasiadas peticiones admin.' },
})

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}))

app.use(compression())

const allowedOrigins = (process.env.ALLOWED_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('No permitido por CORS'))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// Force UTF-8 charset on all JSON responses
app.use((req, res, next) => {
  const originalJson = res.json.bind(res)
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    return originalJson(data)
  }
  next()
})

// ============ HEALTH CHECK ============

app.get('/api/health', async (req, res) => {
  try {
    const conn = await pool.getConnection()
    conn.release()
    res.json({ status: 'ok', timestamp: new Date().toISOString(), database: 'connected' })
  } catch (err) {
    logger.error('Health check failed', { error: err.message })
    res.status(503).json({ status: 'error', timestamp: new Date().toISOString(), database: 'disconnected' })
  }
})

// ============ RATE LIMITERS (order matters) ============

app.use('/api/auth/login', authLimiter)
app.use('/api/contact', contactLimiter)
app.use('/api', apiLimiter)

// ============ FILE UPLOAD ============

const uploadsDir = path.join(__dirname, '../public/uploads')
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`)
  }
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/
    const ext = allowed.test(path.extname(file.originalname).toLowerCase())
    const mime = allowed.test(file.mimetype)
    cb(null, ext && mime)
  }
})

app.use('/uploads', express.static(uploadsDir, { maxAge: '1y', etag: true }))

function sanitizeSvg(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    if (!content.includes('<svg')) return
    const sanitized = content
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
      .replace(/<object[\s\S]*?<\/object>/gi, '')
      .replace(/<embed[\s\S]*?\/?>/gi, '')
      .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
      .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/\bon\w+\s*=\s*[^\s>]*/gi, '')
      .replace(/javascript\s*:/gi, '')
    fs.writeFileSync(filePath, sanitized, 'utf8')
  } catch {}
}

// ============ AUTH ============

if (!process.env.ADMIN_USER || !process.env.ADMIN_PASS) {
  console.error('❌ ADMIN_USER and ADMIN_PASS must be set in .env')
  process.exit(1)
}
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET must be set in .env with at least 32 characters')
  process.exit(1)
}

const ADMIN_USER = process.env.ADMIN_USER
const ADMIN_PASS = process.env.ADMIN_PASS
const JWT_SECRET = process.env.JWT_SECRET

function generateToken() {
  const payload = Buffer.from(JSON.stringify({ created: Date.now() })).toString('base64url')
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

function verifyToken(token) {
  try {
    const [payload, signature] = token.split('.')
    if (!payload || !signature) return null
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('base64url')
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (Date.now() - data.created > 24 * 60 * 60 * 1000) return null
    return data
  } catch {
    return null
  }
}

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'No autorizado. Inicia sesión.' })
  }
  const tokenData = verifyToken(token)
  if (!tokenData) {
    return res.status(401).json({ error: 'Token inválido o expirado.' })
  }
  req.user = tokenData
  next()
}

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' })
  }
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = generateToken()
    return res.json({ success: true, token })
  }
  logger.warn('Failed login attempt', { ip: req.ip, username })
  return res.status(401).json({ error: 'Credenciales incorrectas' })
})

app.get('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (token && verifyToken(token)) {
    return res.json({ valid: true })
  }
  return res.json({ valid: false })
})

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true })
})

// ============ DATABASE ============

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'scorpicore',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  connectTimeout: 60000,
})

async function testConnection() {
  try {
    const conn = await pool.getConnection()
    console.log('✅ MySQL connected to', process.env.DB_HOST || 'localhost')
    conn.release()
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message)
  }
}
testConnection()

// ============ TABLE ALLOWLIST ============

const ALLOWED_TABLES = ['services', 'plans', 'projects', 'testimonials', 'faqs', 'messages', 'seo_settings', 'site_settings']
const READONLY_TABLES = ['site_settings', 'seo_settings']
const ALLOWED_TOGGLE_FIELDS = ['visible', 'popular']
const TABLES_WITH_SORT = ['services', 'plans', 'projects', 'testimonials', 'faqs']
const SEARCH_COLUMNS = {
  services: ['title', 'description'],
  plans: ['name', 'description'],
  projects: ['title', 'description'],
  testimonials: ['name', 'role', 'content'],
  faqs: ['question', 'answer'],
  messages: ['name', 'email', 'description'],
  seo_settings: ['page_key', 'title', 'description'],
}

const TABLE_COLUMNS = {
  services: ['title', 'description', 'features', 'icon', 'color', 'visible', 'sort_order'],
  plans: ['name', 'price', 'description', 'features', 'popular', 'visible', 'sort_order'],
  projects: ['title', 'category', 'description', 'image', 'link', 'visible', 'sort_order'],
  testimonials: ['name', 'role', 'content', 'rating', 'visible', 'sort_order'],
  faqs: ['question', 'answer', 'visible', 'sort_order'],
  messages: ['name', 'email', 'phone', 'company', 'project_type', 'budget', 'description', 'status', 'sort_order'],
  seo_settings: ['page_key', 'title', 'description', 'og_image', 'keywords'],
  site_settings: ['section_key', 'content'],
}

// ============ ZOD VALIDATION SCHEMAS ============

const schemas = {
  services: z.object({
    title: z.string().min(1).max(255),
    description: z.string().min(1),
    features: z.union([z.array(z.string()), z.string()]).optional(),
    icon: z.string().max(100).optional(),
    color: z.string().max(100).optional(),
    visible: z.union([z.boolean(), z.number()]).optional(),
    sort_order: z.number().optional(),
  }),

  plans: z.object({
    name: z.string().min(1).max(255),
    price: z.string().min(1).max(100),
    description: z.string().min(1),
    features: z.union([z.array(z.string()), z.string()]).optional(),
    popular: z.union([z.boolean(), z.number()]).optional(),
    visible: z.union([z.boolean(), z.number()]).optional(),
    sort_order: z.number().optional(),
  }),

  projects: z.object({
    title: z.string().min(1).max(255),
    category: z.string().max(100).optional(),
    description: z.string().min(1),
    image: z.string().max(500).optional(),
    link: z.string().max(500).optional(),
    visible: z.union([z.boolean(), z.number()]).optional(),
    sort_order: z.number().optional(),
  }),

  testimonials: z.object({
    name: z.string().min(1).max(255),
    role: z.string().min(1).max(255),
    content: z.string().min(1),
    rating: z.number().min(1).max(5).optional(),
    visible: z.union([z.boolean(), z.number()]).optional(),
    sort_order: z.number().optional(),
  }),

  faqs: z.object({
    question: z.string().min(1).max(500),
    answer: z.string().min(1),
    visible: z.union([z.boolean(), z.number()]).optional(),
    sort_order: z.number().optional(),
  }),

  messages: z.object({
    name: z.string().min(1).max(255),
    email: z.string().email().max(255),
    phone: z.string().max(50).optional(),
    company: z.string().max(255).optional(),
    project_type: z.string().max(100).optional(),
    budget: z.string().max(100).optional(),
    plan: z.string().max(100).optional(),
    description: z.string().min(1),
    status: z.enum(['nuevo', 'leido', 'respondido', 'archivado']).optional(),
    sort_order: z.number().optional(),
  }),
}

function validateSchema(table, data) {
  const schema = schemas[table]
  if (!schema) return { success: true, data }
  const result = schema.safeParse(data)
  if (!result.success) {
    const errors = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`)
    return { success: false, error: errors.join(', ') }
  }
  return { success: true, data: result.data }
}

function filterColumns(table, data) {
  const allowed = TABLE_COLUMNS[table]
  if (!allowed) return data
  const filtered = {}
  for (const key of allowed) {
    if (data[key] !== undefined) filtered[key] = data[key]
  }
  return filtered
}

function validateTable(table) {
  if (!ALLOWED_TABLES.includes(table)) {
    throw new Error(`Tabla no permitida: ${table}`)
  }
  return true
}

function validateWritableTable(table) {
  validateTable(table)
  if (READONLY_TABLES.includes(table)) {
    throw new Error(`Tabla de solo lectura: ${table}`)
  }
  return true
}

function validateToggleField(field) {
  if (!ALLOWED_TOGGLE_FIELDS.includes(field)) {
    throw new Error(`Campo no permitido: ${field}`)
  }
  return true
}

function isAccessError(msg) {
  return msg.includes('no permitida') || msg.includes('solo lectura') || msg.includes('no permitido')
}

function parseJSON(item) {
  if (!item) return item
  const parsed = { ...item }
  if (typeof parsed.features === 'string') {
    try { parsed.features = JSON.parse(parsed.features) } catch {}
  }
  return parsed
}

// ============ SITE SETTINGS API ============

app.get('/api/site-settings', async (req, res) => {
  try {
    const { section } = req.query
    let query = 'SELECT * FROM site_settings'
    const params = []
    if (section) {
      query += ' WHERE section_key = ?'
      params.push(section)
    }
    const [rows] = await pool.query(query, params)
    const result = {}
    rows.forEach(row => {
      try { result[row.section_key] = JSON.parse(row.content) } catch { result[row.section_key] = row.content }
    })
    res.json(result)
  } catch (err) {
    logger.error('Site settings fetch error', { error: err.message })
    res.status(500).json({ error: 'Error al obtener configuración' })
  }
})

app.put('/api/site-settings/:key', adminLimiter, authMiddleware, async (req, res) => {
  try {
    const { key } = req.params
    const { content } = req.body
    const jsonContent = typeof content === 'string' ? content : JSON.stringify(content)
    await pool.query(
      'INSERT INTO site_settings (section_key, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = ?',
      [key, jsonContent, jsonContent]
    )
    res.json({ success: true, key })
  } catch (err) {
    logger.error('Site settings update error', { error: err.message })
    res.status(500).json({ error: 'Error al guardar configuración' })
  }
})

// ============ PUBLIC API ============

app.get('/api/:table', async (req, res) => {
  try {
    const { table } = req.params
    validateTable(table)
    const { visible, search } = req.query
    let query = `SELECT * FROM \`${table}\``
    const params = []

    if (visible === 'true') {
      query += ' WHERE visible = 1'
    }

    if (search && SEARCH_COLUMNS[table]) {
      const cols = SEARCH_COLUMNS[table]
      const conditions = cols.map(c => `${c} LIKE ?`)
      query += visible === 'true' ? ' AND' : ' WHERE'
      query += ` (${conditions.join(' OR ')})`
      const s = `%${search}%`
      cols.forEach(() => params.push(s))
    }

    if (TABLES_WITH_SORT.includes(table)) {
      query += ' ORDER BY sort_order ASC, created_at DESC'
    } else {
      query += ' ORDER BY created_at DESC'
    }

    const [rows] = await pool.query(query, params)
    res.json(rows.map(parseJSON))
  } catch (err) {
    res.status(isAccessError(err.message) ? 403 : 500).json({ error: err.message })
  }
})

app.get('/api/:table/:id', authMiddleware, async (req, res) => {
  try {
    const { table, id } = req.params
    validateTable(table)
    const [rows] = await pool.query(`SELECT * FROM \`${table}\` WHERE id = ?`, [id])
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' })
    res.json(parseJSON(rows[0]))
  } catch (err) {
    res.status(isAccessError(err.message) ? 403 : 500).json({ error: err.message })
  }
})

// ============ CONTACT FORM ============

const contactSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional(),
  company: z.string().max(255).optional(),
  project_type: z.string().max(100).optional(),
  budget: z.string().max(100).optional(),
  plan: z.string().max(100).optional(),
  description: z.string().min(1),
})

app.post('/api/contact', async (req, res) => {
  try {
    const validation = contactSchema.safeParse(req.body)
    if (!validation.success) {
      const errors = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`)
      return res.status(400).json({ error: errors.join(', ') })
    }
    const { name, email, phone, company, project_type, budget, plan, description } = validation.data

    const [result] = await pool.query(
      'INSERT INTO messages (name, email, phone, company, project_type, budget, plan, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone || null, company || null, project_type || null, budget || null, plan || null, description]
    )

    logger.info('New contact message', { name, email, id: result.insertId })
    res.json({ success: true, id: result.insertId })
  } catch (err) {
    logger.error('Contact form error', { error: err.message })
    res.status(500).json({ error: 'Error al enviar mensaje' })
  }
})

app.put('/api/messages/:id', adminLimiter, authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const allowed = ['nuevo', 'leido', 'respondido', 'archivado']
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Estado no válido' })
    }
    await pool.query('UPDATE messages SET status = ? WHERE id = ?', [status, id])
    const [rows] = await pool.query('SELECT * FROM messages WHERE id = ?', [id])
    if (rows.length === 0) return res.status(404).json({ error: 'Mensaje no encontrado' })
    res.json(rows[0])
  } catch (err) {
    logger.error('Message update error', { error: err.message })
    res.status(500).json({ error: 'Error al actualizar mensaje' })
  }
})

// ============ UPLOAD API ============

app.post('/api/upload', adminLimiter, authMiddleware, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'Archivo muy grande (máx 5MB)' })
      return res.status(400).json({ error: 'Tipo de archivo no permitido' })
    }
    if (!req.file) return res.status(400).json({ error: 'No se envió ningún archivo' })
    if (req.file.mimetype === 'image/svg+xml') {
      sanitizeSvg(req.file.path)
    }
    const url = `/uploads/${req.file.filename}`
    res.json({ success: true, url, filename: req.file.filename })
  })
})

app.delete('/api/upload/:filename', adminLimiter, authMiddleware, (req, res) => {
  try {
    const safeName = path.basename(req.params.filename)
    if (safeName !== req.params.filename || safeName === '..' || safeName === '.') {
      return res.status(400).json({ error: 'Nombre de archivo no válido' })
    }
    const filePath = path.join(uploadsDir, safeName)
    const resolved = path.resolve(filePath)
    if (!resolved.startsWith(path.resolve(uploadsDir))) {
      return res.status(400).json({ error: 'Nombre de archivo no válido' })
    }
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return res.json({ success: true })
    }
    res.status(404).json({ error: 'Archivo no encontrado' })
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// ============ ADMIN API ============

app.post('/api/:table', adminLimiter, authMiddleware, async (req, res) => {
  try {
    const { table } = req.params
    validateWritableTable(table)
    const data = { ...req.body }

    const validation = validateSchema(table, data)
    if (!validation.success) {
      return res.status(400).json({ error: validation.error })
    }

    if (Array.isArray(data.features)) {
      data.features = JSON.stringify(data.features)
    }

    delete data.id
    delete data.created_at
    delete data.updated_at

    if (data.visible === undefined) data.visible = true
    if (data.sort_order === undefined && TABLES_WITH_SORT.includes(table)) data.sort_order = 0

    const filtered = filterColumns(table, data)
    const [result] = await pool.query(`INSERT INTO \`${table}\` SET ?`, [filtered])
    const [rows] = await pool.query(`SELECT * FROM \`${table}\` WHERE id = ?`, [result.insertId])
    logger.info('Created', { table, id: result.insertId })
    res.json(parseJSON(rows[0]))
  } catch (err) {
    logger.error('Create error', { table: req.params.table, error: err.message })
    res.status(isAccessError(err.message) ? 403 : 500).json({ error: err.message })
  }
})

app.put('/api/:table/:id', adminLimiter, authMiddleware, async (req, res) => {
  try {
    const { table, id } = req.params
    validateWritableTable(table)
    const data = { ...req.body }

    const validation = validateSchema(table, data)
    if (!validation.success) {
      return res.status(400).json({ error: validation.error })
    }

    if (Array.isArray(data.features)) {
      data.features = JSON.stringify(data.features)
    }

    delete data.id
    delete data.created_at
    delete data.updated_at

    const filtered = filterColumns(table, data)
    const [result] = await pool.query(`UPDATE \`${table}\` SET ? WHERE id = ?`, [filtered, id])
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Elemento no encontrado' })

    const [rows] = await pool.query(`SELECT * FROM \`${table}\` WHERE id = ?`, [id])
    logger.info('Updated', { table, id })
    res.json(parseJSON(rows[0]))
  } catch (err) {
    logger.error('Update error', { table: req.params.table, id: req.params.id, error: err.message })
    res.status(isAccessError(err.message) ? 403 : 500).json({ error: err.message })
  }
})

app.delete('/api/:table/:id', adminLimiter, authMiddleware, async (req, res) => {
  try {
    const { table, id } = req.params
    validateWritableTable(table)

    const [existing] = await pool.query(`SELECT * FROM \`${table}\` WHERE id = ?`, [id])
    if (existing.length === 0) return res.status(404).json({ error: 'Elemento no encontrado' })

    const row = existing[0]
    if (row.image && row.image.startsWith('/uploads/')) {
      const filePath = path.join(uploadsDir, path.basename(row.image))
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }

    // Soft delete: set visible to 0 instead of deleting
    await pool.query(`UPDATE \`${table}\` SET visible = 0 WHERE id = ?`, [id])
    logger.info('Soft deleted', { table, id })
    res.json({ success: true })
  } catch (err) {
    logger.error('Delete error', { table: req.params.table, id: req.params.id, error: err.message })
    res.status(isAccessError(err.message) ? 403 : 500).json({ error: err.message })
  }
})

app.patch('/api/:table/:id/toggle', adminLimiter, authMiddleware, async (req, res) => {
  try {
    const { table, id } = req.params
    const { field } = req.query
    validateWritableTable(table)
    validateToggleField(field || 'visible')
    const col = field || 'visible'
    await pool.query(`UPDATE \`${table}\` SET \`${col}\` = NOT \`${col}\` WHERE id = ?`, [id])
    const [rows] = await pool.query(`SELECT * FROM \`${table}\` WHERE id = ?`, [id])
    if (rows.length === 0) return res.status(404).json({ error: 'Elemento no encontrado' })
    res.json(parseJSON(rows[0]))
  } catch (err) {
    res.status(isAccessError(err.message) ? 403 : 500).json({ error: err.message })
  }
})

// ============ PUBLIC API ============

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist'), {
    maxAge: '1y',
    etag: true,
  }))

  app.get('{*splat}', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../dist/index.html'))
    }
  })
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ScorpiCore server running on port ${PORT}`)
})
