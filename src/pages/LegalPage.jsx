import { ArrowLeft } from 'lucide-react'
import { config } from '../config'

const pages = {
  privacidad: {
    title: 'Política de Privacidad',
    lastUpdated: '19 de julio de 2026',
    sections: [
      {
        title: '1. Información que recopilamos',
        content:
          'Recopilamos información que usted nos proporciona directamente al contactarnos a través de nuestro formulario, correo electrónico o WhatsApp. Esta información puede incluir: nombre, correo electrónico, número de teléfono, nombre de la empresa y descripción de su proyecto.',
      },
      {
        title: '2. Uso de la información',
        content:
          'Utilizamos su información para: responder a sus consultas, enviar cotizaciones, mejorar nuestros servicios, y comunicarnos con usted sobre su proyecto. No utilizamos su información para fines de marketing sin su consentimiento explícito.',
      },
      {
        title: '3. Protección de datos',
        content:
          'Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Sus datos se almacenan en servidores seguros con cifrado.',
      },
      {
        title: '4. Compartición de información',
        content:
          'No vendemos, intercambiamos ni transferimos su información personal a terceros. Esta información puede ser compartida únicamente con proveedores de servicios que nos ayudan a operar nuestro sitio web y brindar nuestros servicios, siempre bajo acuerdos de confidencialidad.',
      },
      {
        title: '5. Cookies',
        content:
          'Nuestro sitio web puede utilizar cookies y tecnologías similares para mejorar su experiencia de navegación, analizar el tráfico del sitio y personalizar el contenido. Puede configurar su navegador para rechazar cookies, aunque esto podría afectar la funcionalidad del sitio.',
      },
      {
        title: '6. Sus derechos',
        content:
          'Usted tiene derecho a: acceder a su información personal, corregir datos inexactos, solicitar la eliminación de sus datos, y oponerse al procesamiento de su información. Para ejercer estos derechos, contáctenos a través de nuestros canales oficiales.',
      },
      {
        title: '7. Retención de datos',
        content:
          'Conservamos su información personal solo durante el tiempo necesario para los fines para los que fue recopilada, o según lo requiera la ley applicable. Los datos de contacto se mantienen durante la relación comercial y por un período adicional de 2 años.',
      },
      {
        title: '8. Cambios en esta política',
        content:
          'Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Los cambios serán publicados en esta página con la fecha de la última actualización. Le recomendamos revisar esta política periódicamente.',
      },
      {
        title: '9. Contacto',
        content: `Si tiene preguntas sobre esta Política de Privacidad o sobre el tratamiento de sus datos personales, puede contactarnos a través de correo electrónico a ${config.contact.email} o por WhatsApp al ${config.contact.phone}.`,
      },
    ],
  },
  terminos: {
    title: 'Términos de Servicio',
    lastUpdated: '19 de julio de 2026',
    sections: [
      {
        title: '1. Aceptación de los términos',
        content:
          'Al acceder y utilizar los servicios de ScorpiCore, usted acepta estos Términos de Servicio. Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios.',
      },
      {
        title: '2. Descripción de servicios',
        content:
          'ScorpiCore ofrece servicios de desarrollo de soluciones digitales, incluyendo pero no limitado a: landing pages, sitios web corporativos, tiendas online, software a medida, y automatización de procesos. El alcance específico de cada servicio se define en la cotización y contrato correspondiente.',
      },
      {
        title: '3. Proceso de trabajo',
        content:
          'Cada proyecto sigue nuestro proceso de 6 fases: Descubrimiento, Diseño, Desarrollo, Testing, Lanzamiento y Soporte. Los plazos de entrega se acuerdan al inicio del proyecto y se documentan en la cotización. Los retrasos en las entregas de material por parte del cliente pueden afectar los plazos acordados.',
      },
      {
        title: '4. Pagos',
        content:
          'El modelo de pago estándar es 50% al inicio del proyecto y 50% a la entrega. Para proyectos de software a medida, se pueden acordar pagos por hitos. Los precios están en USD y pueden pagarse mediante transferencia bancaria, tarjeta de crédito/débito o criptomonedas.',
      },
      {
        title: '5. Propiedad intelectual',
        content:
          'Una vez completado el pago total, el cliente obtiene los derechos de propiedad intelectual del proyecto entregado. ScorpiCore se reserva el derecho de mostrar el proyecto en su portafolio, salvo acuerdo expreso en contrario.',
      },
      {
        title: '6. Garantía',
        content:
          'Ofrecemos garantía de 30 días post-lanzamiento para corrección de errores sin costo adicional. Los cambios solicitados fuera del alcance original del proyecto se cotizan por separado. No cubrimimos problemas causados por modificaciones realizadas por terceros.',
      },
      {
        title: '7. Soporte post-lanzamiento',
        content:
          'El soporte post-lanzamiento incluido varía según el plan contratado. Desde 30 días de soporte básico hasta soporte continuo con mantenimiento mensual. Los planes de mantenimiento mensual se renuevan automáticamente salvo cancelación con 15 días de anticipación.',
      },
      {
        title: '8. Limitación de responsabilidad',
        content:
          'ScorpiCore no será responsable por daños indirectos, pérdidas de beneficios, o daños emergentes derivados del uso de nuestros servicios. Nuestra responsabilidad máxima se limita al monto total pagado por el servicio contratado.',
      },
      {
        title: '9. Resolución de conflictos',
        content:
          'Cualquier disputa derivada de estos términos se resolverá primero mediante negociación directa. Si no se llega a un acuerdo, las partes acuerdan someterse a la jurisdicción de los tribunales de Colombia.',
      },
      {
        title: '10. Contacto',
        content: `Para preguntas sobre estos Términos de Servicio, contáctenos a través de correo electrónico a ${config.contact.email} o por WhatsApp al ${config.contact.phone}.`,
      },
    ],
  },
}

export default function LegalPage({ type, onBack }) {
  const page = pages[type]
  if (!page) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al sitio
        </button>

        <h1 className="text-3xl font-extrabold text-brand-secondary">{page.title}</h1>
        <p className="mt-2 text-sm text-slate-400">Última actualización: {page.lastUpdated}</p>

        <div className="mt-10 space-y-8">
          {page.sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-bold text-brand-secondary">{section.title}</h2>
              <p className="mt-2 leading-relaxed text-slate-600">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} ScorpiCore. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}
