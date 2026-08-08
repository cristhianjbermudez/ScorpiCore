-- ScorpiCore Database Schema
-- Run this in MySQL to create all tables

CREATE DATABASE IF NOT EXISTS scorpicore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE scorpicore;

-- Services
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  features JSON,
  icon VARCHAR(100),
  color VARCHAR(100) DEFAULT 'from-blue-500 to-blue-600',
  visible TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects (Portfolio)
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500),
  link VARCHAR(500),
  visible TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Plans (Pricing)
CREATE TABLE IF NOT EXISTS plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  features JSON,
  popular TINYINT(1) DEFAULT 0,
  visible TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  rating INT DEFAULT 5,
  visible TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- FAQs
CREATE TABLE IF NOT EXISTS faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  visible TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  project_type VARCHAR(100),
  budget VARCHAR(100),
  plan VARCHAR(100),
  description TEXT NOT NULL,
  status ENUM('nuevo', 'leido', 'respondido', 'archivado') DEFAULT 'nuevo',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Site Settings (CMS sections)
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_key VARCHAR(100) UNIQUE NOT NULL,
  content LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SEO Settings
CREATE TABLE IF NOT EXISTS seo_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_key VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255),
  description TEXT,
  og_image VARCHAR(500),
  keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default data
INSERT INTO services (title, description, features, icon, color, sort_order) VALUES
('Landing Pages', 'Páginas de aterrizaje de alta conversión diseñadas para transformar visitantes en clientes desde el primer scroll.', '["Diseño premium personalizado","Optimización para conversión","Carga en menos de 1 segundo","SEO técnico incluido"]', 'Globe', 'from-blue-500 to-blue-600', 1),
('Sitios Web Corporativos', 'Presencia digital institucional que comunica autoridad, confianza y liderazgo en tu industria.', '["Arquitectura escalable","CMS autogestionable","Multi-idioma","Integraciones corporativas"]', 'Building2', 'from-indigo-500 to-indigo-600', 2),
('Tiendas Online', 'E-commerce completo con carrito, pasarelas de pago, gestión de inventario y analítica avanzada.', '["Pasarelas de pago seguras","Gestión de productos","Optimización móvil","Analítica integrada"]', 'ShoppingCart', 'from-purple-500 to-purple-600', 3),
('Software a Medida', 'Sistemas administrativos y aplicaciones web construidos específicamente para los procesos únicos de tu empresa.', '["Arquitectura a medida","APIs e integraciones","Escalabilidad vertical","Soporte continuo"]', 'Code2', 'from-violet-500 to-violet-600', 4),
('Automatización de Procesos', 'Eliminamos tareas repetitivas y conectamos tus herramientas para que tu equipo se concentre en lo importante.', '["Integración de sistemas","Workflows automatizados","Notificaciones inteligentes","Ahorro de horas semanales"]', 'Workflow', 'from-cyan-500 to-cyan-600', 5),
('SEO', 'Posicionamiento orgánico en Google con estrategia técnica, de contenido y de autoridad para captar tráfico cualificado.', '["Auditoría técnica","Estrategia de contenido","Link building ético","Reportes mensuales"]', 'Search', 'from-sky-500 to-sky-600', 6);

INSERT INTO plans (name, price, description, features, popular, sort_order) VALUES
('Landing', '$899 USD', 'Página de aterrizaje profesional para validar tu idea o lanzar una campaña.', '["1 página de alta conversión","Diseño premium personalizado","Formulario de contacto","SEO básico","Hosting 1 año","Entrega en 7 días"]', 0, 1),
('Corporativa', '$2,499 USD', 'Sitio web institucional completo para empresas que proyectan liderazgo.', '["Hasta 8 páginas","Diseño premium personalizado","CMS autogestionable","SEO técnico completo","Multi-idioma","Hosting + Dominio 1 año","Soporte 30 días"]', 0, 2),
('Premium', '$4,999 USD', 'Plataforma web avanzada con integraciones y funcionalidades a medida.', '["Páginas ilimitadas","Diseño premium personalizado","Funcionalidades a medida","Integraciones con APIs","SEO avanzado + Analytics","Hosting + Dominio 1 año","Soporte 90 días","Capacitación incluida"]', 1, 3),
('Software Personalizado', 'A medida', 'Sistemas administrativos y aplicaciones web construidos desde cero para tu empresa.', '["Análisis de requisitos","Arquitectura a medida","Desarrollo full-stack","Integraciones de sistemas","Automatización de procesos","Hosting + Dominio 1 año","Soporte continuo","Mantenimiento incluido"]', 0, 4);

INSERT INTO faqs (question, answer, sort_order) VALUES
('¿Cuánto tarda el desarrollo de un proyecto?', 'Una landing page se entrega en 7 días, un sitio corporativo en 2-3 semanas y un software a medida entre 6 y 16 semanas según la complejidad. Siempre definimos un cronograma claro antes de comenzar.', 1),
('¿Puedo solicitar cambios durante el desarrollo?', 'Por supuesto. Trabajamos por fases con revisiones en cada etapa. Los cambios que entren en el alcance original son sin costo. Cambios de alcance adicionales se cotizan aparte con total transparencia.', 2),
('¿Qué pasa después del lanzamiento?', 'No te dejamos solo después del lanzamiento. Todos los planes incluyen soporte post-lanzamiento (de 30 días a soporte continuo según el plan). Además ofrecemos planes de mantenimiento mensual para mantener todo actualizado y seguro.', 3),
('¿El sitio será administrable por mi equipo?', 'Absolutamente. Implementamos un panel de administración intuitivo para que tu equipo gestione contenido, imágenes, productos y datos sin necesidad de conocimientos técnicos.', 4),
('¿Incluyen hosting y dominio?', 'Sí, todos nuestros planes incluyen hosting premium y dominio durante el primer año. El hosting utiliza infraestructura en la nube con SSL, backups automáticos y CDN incluido.', 5),
('¿Trabajan con empresas de otros países?', 'Sí. Trabajamos de forma 100% remota con clientes en Latinoamérica, Estados Unidos y Europa. Nos adaptamos a tu zona horaria y coordinamos reuniones virtuales.', 6),
('¿Cómo es el proceso de pago?', 'Trabajamos con un 50% al inicio y 50% a la entrega. Para proyectos de software a medida, dividimos en hitos. Aceptamos transferencia, tarjetas y criptomonedas.', 7),
('¿Ofrecen garantía?', 'Sí. Garantizamos que el sitio funcione según lo acordado. Si detectas un error en los primeros 30 días post-lanzamiento, lo corregimos sin costo.', 8);

INSERT INTO projects (title, category, description, sort_order) VALUES
('Nimbus Analytics', 'Web Corporativa', 'Plataforma SaaS de analítica en tiempo real. Dashboard intuitivo con visualización de datos avanzada.', 1),
('Aurea Boutique', 'Tienda Online', 'E-commerce de moda premium con experiencia de compra inmersiva y checkout optimizado.', 2),
('Vertex CRM', 'Software', 'Sistema de gestión de relaciones con clientes construido a medida para una empresa logística internacional.', 3),
('Helix Health', 'Web Corporativa', 'Sitio institucional para una clínica de salud digital con reservas online integradas.', 4),
('Pulse Fitness', 'Landing Page', 'Landing de alta conversión para una cadena de gimnasios con campaña de captación integrada.', 5),
('Orbit Travel', 'Tienda Online', 'Plataforma de reservas de viajes con buscador inteligente y pasarela de pago integrada.', 6);

INSERT INTO seo_settings (page_key, title, description, keywords) VALUES
('home', 'ScorpiCore | Desarrollo de Soluciones Digitales de Alto Nivel', 'ScorpiCore crea landing pages, sitios corporativos, tiendas online y software a medida. Diseño premium, performance 100/100 y conversión optimizada. Solicita tu cotización gratis.', 'desarrollo web, landing pages, tiendas online, software a medida, SEO, automatización, e-commerce, aplicaciones web'),
('services', 'Servicios | ScorpiCore - Landing Pages, Sitios Corporativos, Software a Medida', 'Ofrecemos landing pages de alta conversión, sitios web corporativos, tiendas online, software a medida, automatización de procesos y SEO.', 'servicios web, landing pages, sitios corporativos, software a medida'),
('pricing', 'Planes y Precios | ScorpiCore - Inversión Clara sin Sorpresas', 'Planes de desarrollo web desde $899 USD. Landing pages, sitios corporativos, tiendas online y software personalizado con hosting incluido.', 'precios desarrollo web, planes landing page, costo sitio web');
