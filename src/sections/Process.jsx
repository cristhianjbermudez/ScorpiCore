import { Search } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import { useSettings } from '../lib/useSettings'
import { resolveIcon } from '../lib/icons'

const defaultSteps = [
  {
    icon: 'Search',
    number: '01',
    title: 'Entendemos tu negocio',
    description:
      'No empezamos a diseñar sin conocerte. Hablamos de tus objetivos, tu mercado y tus clientes para que el resultado sea exactamente lo que necesitas.',
  },
  {
    icon: 'Palette',
    number: '02',
    title: 'Diseño que convierte',
    description:
      'Creamos un diseño premium pensado para guiar a tu visitante hacia la acción. Cada pixel tiene un propósito: generar un cliente más.',
  },
  {
    icon: 'Code',
    number: '03',
    title: 'Desarrollo de alto nivel',
    description:
      'Construimos tu sitio con tecnologías probadas a escala mundial. Rápido, seguro y preparado para crecer con tu negocio.',
  },
  {
    icon: 'TestTube',
    number: '04',
    title: 'Pruebas exhaustivas',
    description:
      'Probamos cada detalle antes de que tu sitio se publique. Velocidad, seguridad, usabilidad y compatibilidad: todo verificado.',
  },
  {
    icon: 'Rocket',
    number: '05',
    title: 'Lanzamiento',
    description:
      'Tu sitio se publica con todo optimizado: hosting rápido, SSL activo, dominio configurado y rendimiento al máximo.',
  },
  {
    icon: 'Wrench',
    number: '06',
    title: 'Soporte continuo',
    description:
      'No desaparecemos después del lanzamiento. Mantenimiento, actualizaciones de seguridad y soporte técnico cuando lo necesites.',
  },
]

const defaultProcess = {
  badge: 'Cómo trabajamos',
  heading: 'Un proceso claro. ',
  headingHighlight: 'Cero sorpresas',
  subtitle:
    'Sabemos que tu tiempo vale dinero. Por eso cada proyecto sigue un método probado que garantiza resultados sin improvisación.',
}

export default function Process() {
  const { data: settings } = useSettings('process')
  const steps = settings?.steps || defaultSteps
  const heading = settings?.heading || defaultProcess.heading
  const headingHighlight = settings?.headingHighlight || defaultProcess.headingHighlight
  const subtitle = settings?.subtitle || defaultProcess.subtitle
  const badge = settings?.badge || defaultProcess.badge

  return (
    <section id="proceso" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-4 py-1.5 text-sm font-medium text-brand-primary">
            {badge}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-secondary sm:text-4xl lg:text-5xl">
            {heading} <span className="gradient-text">{headingHighlight}</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500">{subtitle}</p>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = resolveIcon(step.icon) || Search
            return (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="group relative">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-glow transition-transform duration-500 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-4xl font-extrabold text-slate-100">{step.number}</span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-brand-secondary">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{step.description}</p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
