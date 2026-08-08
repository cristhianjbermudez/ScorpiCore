const mysql = require('mysql2/promise')

const faqs = [
  { question: '¿Cuánto tarda el desarrollo de un proyecto?', answer: 'Una landing page se entrega en 7 días, un sitio corporativo en 2-3 semanas y un software a medida entre 6 y 16 semanas según la complejidad. Siempre definimos un cronograma claro antes de comenzar.', sort_order: 1 },
  { question: '¿Puedo solicitar cambios durante el desarrollo?', answer: 'Por supuesto. Trabajamos por fases con revisiones en cada etapa. Los cambios que entren en el alcance original son sin costo. Cambios de alcance adicionales se cotizan aparte con total transparencia.', sort_order: 2 },
  { question: '¿Qué pasa después del lanzamiento?', answer: 'No te dejamos solo después del lanzamiento. Todos los planes incluyen soporte post-lanzamiento (de 30 días a soporte continuo según el plan). Además ofrecemos planes de mantenimiento mensual para mantener todo actualizado y seguro.', sort_order: 3 },
  { question: '¿El sitio será administrable por mi equipo?', answer: 'Absolutamente. Implementamos un panel de administración intuitivo para que tu equipo gestione contenido, imágenes, productos y datos sin necesidad de conocimientos técnicos.', sort_order: 4 },
  { question: '¿Incluyen hosting y dominio?', answer: 'Sí, todos nuestros planes incluyen hosting premium y dominio durante el primer año. El hosting utiliza infraestructura en la nube con SSL, backups automáticos y CDN incluido.', sort_order: 5 },
  { question: '¿Trabajan con empresas de otros países?', answer: 'Sí. Trabajamos de forma 100% remota con clientes en Latinoamérica, Estados Unidos y Europa. Nos adaptamos a tu zona horaria y coordinamos reuniones virtuales.', sort_order: 6 },
  { question: '¿Cómo es el proceso de pago?', answer: 'Trabajamos con un 50% al inicio y 50% a la entrega. Para proyectos de software a medida, dividimos en hitos. Aceptamos transferencia, tarjetas y criptomonedas.', sort_order: 7 },
  { question: '¿Ofrecen garantía?', answer: 'Sí. Garantizamos que el sitio funcione según lo acordado. Si detectas un error en los primeros 30 días post-lanzamiento, lo corregimos sin costo.', sort_order: 8 },
]

async function fixFaqs() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'scorpicore',
    charset: 'utf8mb4'
  })

  for (const faq of faqs) {
    await pool.query('UPDATE faqs SET question = ?, answer = ? WHERE sort_order = ?', [faq.question, faq.answer, faq.sort_order])
    console.log(`✓ FAQ #${faq.sort_order}: ${faq.question.substring(0, 40)}...`)
  }

  await pool.end()
  console.log('\nAll FAQs updated with correct UTF-8 encoding!')
}

fixFaqs().catch(err => { console.error(err); process.exit(1) })
