const mysql = require('mysql2/promise')

async function check() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: 'admin', database: 'scorpicore', charset: 'utf8mb4' })

  const [projects] = await pool.query('SELECT id, title, image FROM projects WHERE image IS NOT NULL')
  console.log('Projects with images:', JSON.stringify(projects, null, 2))

  await pool.end()
}

check().catch(console.error)
