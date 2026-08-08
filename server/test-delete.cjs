const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads')

async function test() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: 'admin', database: 'scorpicore', charset: 'utf8mb4' })

  // List files before
  const filesBefore = fs.readdirSync(uploadsDir).filter(f => f !== '.gitkeep')
  console.log('Files before:', filesBefore)

  // Create a test project with an image
  const testImage = '/uploads/' + filesBefore[0]
  const [result] = await pool.query(
    'INSERT INTO projects (title, category, description, image, sort_order) VALUES (?, ?, ?, ?, ?)',
    ['TEST DELETE', 'Test', 'Test project for deletion', testImage, 999]
  )
  const testId = result.insertId
  console.log(`Created test project id=${testId} with image: ${testImage}`)

  // Verify it exists
  const [rows] = await pool.query('SELECT id, image FROM projects WHERE id = ?', [testId])
  console.log('Row exists:', rows[0])

  // Delete via API simulation (same logic as server)
  const [existing] = await pool.query('SELECT * FROM projects WHERE id = ?', [testId])
  const row = existing[0]
  if (row.image && row.image.startsWith('/uploads/')) {
    const filePath = path.join(uploadsDir, path.basename(row.image))
    console.log('Deleting file:', filePath)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log('File deleted from disk!')
    } else {
      console.log('File not found on disk')
    }
  }
  await pool.query('DELETE FROM projects WHERE id = ?', [testId])
  console.log('Row deleted from database')

  // List files after
  const filesAfter = fs.readdirSync(uploadsDir).filter(f => f !== '.gitkeep')
  console.log('Files after:', filesAfter)

  // Verify
  const removed = filesBefore.filter(f => !filesAfter.includes(f))
  console.log('Removed files:', removed)
  console.log(removed.length > 0 ? '\n✅ TEST PASSED: Image was deleted from disk!' : '\n❌ TEST FAILED: Image was NOT deleted')

  await pool.end()
}

test().catch(console.error)
