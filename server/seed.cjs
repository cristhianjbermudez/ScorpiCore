require('dotenv').config()
const mysql = require('mysql2/promise')

async function seed() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  const conn = await pool.getConnection()
  console.log('✅ Connected to MySQL')

  try {
    // Services
    const services = [
      ['Landing Pages', 'Páginas de aterrizaje de alta conversión diseñadas para transformar visitantes en clientes desde el primer scroll.', '["Diseño premium personalizado","Optimización para conversión","Carga en menos de 1 segundo","SEO técnico incluido"]', 'Globe', 'from-blue-500 to-blue-600'],
      ['Sitios Web Corporativos', 'Presencia digital institucional que comunica autoridad, confianza y liderazgo en tu industria.', '["Arquitectura escalable","CMS autogestionable","Multi-idioma","Integraciones corporativas"]', 'Building2', 'from-indigo-500 to-indigo-600'],
      ['Tiendas Online', 'E-commerce completo con carrito, pasarelas de pago, gestión de inventario y analítica avanzada.', '["Pasarelas de pago seguras","Gestión de productos","Optimización móvil","Analítica integrada"]', 'ShoppingCart', 'from-purple-500 to-purple-600'],
      ['Software a Medida', 'Sistemas administrativos y aplicaciones web construidos específicamente para los procesos únicos de tu empresa.', '["Arquitectura a medida","APIs e integraciones","Escalabilidad vertical","Soporte continuo"]', 'Code2', 'from-violet-500 to-violet-600'],
      ['Automatización de Procesos', 'Eliminamos tareas repetitivas y conectamos tus herramientas para que tu equipo se concentre en lo importante.', '["Integración de sistemas","Workflows automatizados","Notificaciones inteligentes","Ahorro de horas semanales"]', 'Workflow', 'from-cyan-500 to-cyan-600'],
      ['SEO', 'Posicionamiento orgánico en Google con estrategia técnica, de contenido y de autoridad para captar tráfico cualificado.', '["Auditoría técnica","Estrategia de contenido","Link building ético","Reportes mensuales"]', 'Search', 'from-sky-500 to-sky-600'],
    ]
    for (const [title, desc, features, icon, color] of services) {
      await conn.query('INSERT IGNORE INTO services (title, description, features, icon, color) VALUES (?, ?, ?, ?, ?)', [title, desc, features, icon, color])
    }
    console.log('✅ Services seeded')

    // Plans
    const plans = [
      ['Landing', '$899 USD', 'Página de aterrizaje profesional para validar tu idea o lanzar una campaña.', '["1 página de alta conversión","Diseño premium personalizado","Formulario de contacto","SEO básico","Hosting 1 año","Entrega en 7 días"]', 0],
      ['Corporativa', '$2,499 USD', 'Sitio web institucional completo para empresas que proyectan liderazgo.', '["Hasta 8 páginas","Diseño premium personalizado","CMS autogestionable","SEO técnico completo","Multi-idioma","Hosting + Dominio 1 año","Soporte 30 días"]', 0],
      ['Premium', '$4,999 USD', 'Plataforma web avanzada con integraciones y funcionalidades a medida.', '["Páginas ilimitadas","Diseño premium personalizado","Funcionalidades a medida","Integraciones con APIs","SEO avanzado + Analytics","Hosting + Dominio 1 año","Soporte 90 días","Capacitación incluida"]', 1],
      ['Software Personalizado', 'A medida', 'Sistemas administrativos y aplicaciones web construidos desde cero para tu empresa.', '["Análisis de requisitos","Arquitectura a medida","Desarrollo full-stack","Integraciones de sistemas","Automatización de procesos","Hosting + Dominio 1 año","Soporte continuo","Mantenimiento incluido"]', 0],
    ]
    for (const [name, price, desc, features, popular] of plans) {
      await conn.query('INSERT IGNORE INTO plans (name, price, description, features, popular) VALUES (?, ?, ?, ?, ?)', [name, price, desc, features, popular])
    }
    console.log('✅ Plans seeded')

    // FAQs
    const faqs = [
      ['¿Cuánto tarda el desarrollo de un proyecto?', 'Una landing page se entrega en 7 días, un sitio corporativo en 2-3 semanas y un software a medida entre 6 y 16 semanas según la complejidad. Siempre definimos un cronograma claro antes de comenzar.'],
      ['¿Puedo solicitar cambios durante el desarrollo?', 'Por supuesto. Trabajamos por fases con revisiones en cada etapa. Los cambios que entren en el alcance original son sin costo. Cambios de alcance adicionales se cotizan aparte con total transparencia.'],
      ['¿Qué pasa después del lanzamiento?', 'No te dejamos solo después del lanzamiento. Todos los planes incluyen soporte post-lanzamiento (de 30 días a soporte continuo según el plan). Además ofrecemos planes de mantenimiento mensual para mantener todo actualizado y seguro.'],
      ['¿El sitio será administrable por mi equipo?', 'Absolutamente. Implementamos un panel de administración intuitivo para que tu equipo gestione contenido, imágenes, productos y datos sin necesidad de conocimientos técnicos.'],
      ['¿Incluyen hosting y dominio?', 'Sí, todos nuestros planes incluyen hosting premium y dominio durante el primer año. El hosting utiliza infraestructura en la nube con SSL, backups automáticos y CDN incluido.'],
      ['¿Trabajan con empresas de otros países?', 'Sí. Trabajamos de forma 100% remota con clientes en Latinoamérica, Estados Unidos y Europa. Nos adaptamos a tu zona horaria y coordinamos reuniones virtuales.'],
      ['¿Cómo es el proceso de pago?', 'Trabajamos con un 50% al inicio y 50% a la entrega. Para proyectos de software a medida, dividimos en hitos. Aceptamos transferencia, tarjetas y criptomonedas.'],
      ['¿Ofrecen garantía?', 'Sí. Garantizamos que el sitio funcione según lo acordado. Si detectas un error en los primeros 30 días post-lanzamiento, lo corregimos sin costo.'],
    ]
    for (const [question, answer] of faqs) {
      await conn.query('INSERT IGNORE INTO faqs (question, answer) VALUES (?, ?)', [question, answer])
    }
    console.log('✅ FAQs seeded')

    // Projects
    const projects = [
      ['Nimbus Analytics', 'Web Corporativa', 'Plataforma SaaS de analítica en tiempo real. Dashboard intuitivo con visualización de datos avanzada.'],
      ['Aurea Boutique', 'Tienda Online', 'E-commerce de moda premium con experiencia de compra inmersiva y checkout optimizado.'],
      ['Vertex CRM', 'Software', 'Sistema de gestión de relaciones con clientes construido a medida para una empresa logística internacional.'],
      ['Helix Health', 'Web Corporativa', 'Sitio institucional para una clínica de salud digital con reservas online integradas.'],
      ['Pulse Fitness', 'Landing Page', 'Landing de alta conversión para una cadena de gimnasios con campaña de captación integrada.'],
      ['Orbit Travel', 'Tienda Online', 'Plataforma de reservas de viajes con buscador inteligente y pasarela de pago integrada.'],
    ]
    for (const [title, category, description] of projects) {
      await conn.query('INSERT IGNORE INTO projects (title, category, description) VALUES (?, ?, ?)', [title, category, description])
    }
    console.log('✅ Projects seeded')

    // SEO Settings
    const seo = [
      ['home', 'ScorpiCore | Desarrollo de Soluciones Digitales de Alto Nivel', 'ScorpiCore crea landing pages, sitios corporativos, tiendas online y software a medida. Diseño premium, performance 100/100 y conversión optimizada.', 'desarrollo web, landing pages, tiendas online, software a medida'],
      ['services', 'Servicios | ScorpiCore - Landing Pages, Sitios Corporativos, Software a Medida', 'Ofrecemos landing pages, sitios web, tiendas online, software a medida, automatización y SEO.', 'servicios web, landing pages, sitios corporativos'],
      ['pricing', 'Planes y Precios | ScorpiCore - Inversión Clara sin Sorpresas', 'Planes desde $899 USD. Landing pages, sitios, tiendas online y software con hosting incluido.', 'precios desarrollo web, planes landing page'],
    ]
    for (const [page_key, title, description, keywords] of seo) {
      await conn.query('INSERT IGNORE INTO seo_settings (page_key, title, description, keywords) VALUES (?, ?, ?, ?)', [page_key, title, description, keywords])
    }
    console.log('✅ SEO settings seeded')

    console.log('\n🎉 Database seeded successfully!')
  } catch (err) {
    console.error('❌ Seed error:', err.message)
  } finally {
    conn.release()
    await pool.end()
  }
}

seed()
