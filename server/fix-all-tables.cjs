const mysql = require('mysql2/promise')

const services = [
  { id: 1, title: 'Landing Pages', description: 'Páginas de aterrizaje de alta conversión diseñadas para transformar visitantes en clientes desde el primer scroll.', features: '["Diseño premium personalizado","Optimización para conversión","Carga en menos de 1 segundo","SEO técnico incluido"]', icon: 'Globe', color: 'from-blue-500 to-blue-600', sort_order: 1 },
  { id: 2, title: 'Sitios Web Corporativos', description: 'Presencia digital institucional que comunica autoridad, confianza y liderazgo en tu industria.', features: '["Arquitectura escalable","CMS autogestionable","Multi-idioma","Integraciones corporativas"]', icon: 'Building2', color: 'from-indigo-500 to-indigo-600', sort_order: 2 },
  { id: 3, title: 'Tiendas Online', description: 'E-commerce completo con carrito, pasarelas de pago, gestión de inventario y analítica avanzada.', features: '["Pasarelas de pago seguras","Gestión de productos","Optimización móvil","Analítica integrada"]', icon: 'ShoppingCart', color: 'from-purple-500 to-purple-600', sort_order: 3 },
  { id: 4, title: 'Software a Medida', description: 'Sistemas administrativos y aplicaciones web construidos específicamente para los procesos únicos de tu empresa.', features: '["Arquitectura a medida","APIs e integraciones","Escalabilidad vertical","Soporte continuo"]', icon: 'Code2', color: 'from-violet-500 to-violet-600', sort_order: 4 },
  { id: 5, title: 'Automatización de Procesos', description: 'Eliminamos tareas repetitivas y conectamos tus herramientas para que tu equipo se concentre en lo importante.', features: '["Integración de sistemas","Workflows automatizados","Notificaciones inteligentes","Ahorro de horas semanales"]', icon: 'Workflow', color: 'from-cyan-500 to-cyan-600', sort_order: 5 },
  { id: 6, title: 'SEO', description: 'Posicionamiento orgánico en Google con estrategia técnica, de contenido y de autoridad para captar tráfico cualificado.', features: '["Auditoría técnica","Estrategia de contenido","Link building ético","Reportes mensuales"]', icon: 'Search', color: 'from-sky-500 to-sky-600', sort_order: 6 },
]

const plans = [
  { id: 1, name: 'Landing', price: '$899 USD', description: 'Página de aterrizaje profesional para validar tu idea o lanzar una campaña.', features: '["1 página de alta conversión","Diseño premium personalizado","Formulario de contacto","SEO básico","Hosting 1 año","Entrega en 7 días"]', popular: 0, sort_order: 1 },
  { id: 2, name: 'Corporativa', price: '$2,499 USD', description: 'Sitio web institucional completo para empresas que proyectan liderazgo.', features: '["Hasta 8 páginas","Diseño premium personalizado","CMS autogestionable","SEO técnico completo","Multi-idioma","Hosting + Dominio 1 año","Soporte 30 días"]', popular: 0, sort_order: 2 },
  { id: 3, name: 'Premium', price: '$4,999 USD', description: 'Plataforma web avanzada con integraciones y funcionalidades a medida.', features: '["Páginas ilimitadas","Diseño premium personalizado","Funcionalidades a medida","Integraciones con APIs","SEO avanzado + Analytics","Hosting + Dominio 1 año","Soporte 90 días","Capacitación incluida"]', popular: 1, sort_order: 3 },
  { id: 4, name: 'Software Personalizado', price: 'A medida', description: 'Sistemas administrativos y aplicaciones web construidos desde cero para tu empresa.', features: '["Análisis de requisitos","Arquitectura a medida","Desarrollo full-stack","Integraciones de sistemas","Automatización de procesos","Hosting + Dominio 1 año","Soporte continuo","Mantenimiento incluido"]', popular: 0, sort_order: 4 },
]

const projects = [
  { id: 1, title: 'Nimbus Analytics', category: 'Web Corporativa', description: 'Plataforma SaaS de analítica en tiempo real. Dashboard intuitivo con visualización de datos avanzada.', sort_order: 1 },
  { id: 2, title: 'Aurea Boutique', category: 'Tienda Online', description: 'E-commerce de moda premium con experiencia de compra inmersiva y checkout optimizado.', sort_order: 2 },
  { id: 3, title: 'Vertex CRM', category: 'Software', description: 'Sistema de gestión de relaciones con clientes construido a medida para una empresa logística internacional.', sort_order: 3 },
  { id: 4, title: 'Helix Health', category: 'Web Corporativa', description: 'Sitio institucional para una clínica de salud digital con reservas online integradas.', sort_order: 4 },
  { id: 5, title: 'Pulse Fitness', category: 'Landing Page', description: 'Landing de alta conversión para una cadena de gimnasios con campaña de captación integrada.', sort_order: 5 },
  { id: 6, title: 'Orbit Travel', category: 'Tienda Online', description: 'Plataforma de reservas de viajes con buscador inteligente y pasarela de pago integrada.', sort_order: 6 },
]

async function fixAll() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'scorpicore',
    charset: 'utf8mb4'
  })

  for (const s of services) {
    await pool.query('UPDATE services SET title = ?, description = ?, features = ? WHERE sort_order = ?', [s.title, s.description, s.features, s.sort_order])
    console.log(`✓ service: ${s.title}`)
  }

  for (const p of plans) {
    await pool.query('UPDATE plans SET name = ?, price = ?, description = ?, features = ? WHERE sort_order = ?', [p.name, p.price, p.description, p.features, p.sort_order])
    console.log(`✓ plan: ${p.name}`)
  }

  for (const p of projects) {
    await pool.query('UPDATE projects SET title = ?, category = ?, description = ? WHERE sort_order = ?', [p.title, p.category, p.description, p.sort_order])
    console.log(`✓ project: ${p.title}`)
  }

  await pool.end()
  console.log('\nAll tables fixed!')
}

fixAll().catch(err => { console.error(err); process.exit(1) })
