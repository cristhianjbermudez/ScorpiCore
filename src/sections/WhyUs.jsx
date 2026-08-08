import { TrendingUp } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import { useSettings } from '../lib/useSettings'
import { resolveIcon } from '../lib/icons'

const defaultReasons = [
  {
    icon: 'TrendingUp',
    title: 'Diseñados para generar clientes',
    description:
      'No creamos páginas bonitas. Creamos máquinas de conversión. Cada botón, cada texto y cada imagen está pensado para que tu visitante se convierta en cliente.',
    metric: '+42%',
    metricLabel: 'más conversiones en promedio',
  },
  {
    icon: 'Zap',
    title: 'Carga instantánea',
    description:
      'Tu página carga en menos de 1 segundo. Tus clientes no esperan y Google tampoco. Velocidad = más ventas. Punto.',
    metric: '< 1s',
    metricLabel: 'tiempo de carga',
  },
  {
    icon: 'Shield',
    title: 'Seguridad sin preocupaciones',
    description:
      'SSL, backups diarios, protección contra ataques y actualizaciones automáticas. Tu sitio y los datos de tus clientes siempre seguros.',
    metric: '99.9%',
    metricLabel: 'disponibilidad garantizada',
  },
  {
    icon: 'Target',
    title: 'Performance perfecto',
    description:
      '100/100 en Lighthouse. No es un número: es la garantía de que tu sitio funciona al máximo en velocidad, SEO y accesibilidad.',
    metric: '100/100',
    metricLabel: 'Lighthouse Score',
  },
  {
    icon: 'Scaling',
    title: 'Crece sin límites',
    description:
      'Tu sitio funciona igual con 100 visitas que con 1 millón. No te preocupes por el éxito: nosotros nos encargamos de que la tecnología no te frene.',
    metric: '1M+',
    metricLabel: 'visitantes sin problemas',
  },
  {
    icon: 'Headphones',
    title: 'Soporte humano y rápido',
    description:
      'No te dejamos solo después del lanzamiento. Respondemos en menos de 2 horas, conocemos tu proyecto y resolvemos lo que necesites.',
    metric: '< 2h',
    metricLabel: 'respuesta garantizada',
  },
]

const defaultWhyUs = {
  badge: 'Por qué elegirnos',
  heading: 'No vendemos código. Vendemos ',
  headingHighlight: 'resultados',
  subtitle:
    'Cada decisión que tomamos tiene un solo objetivo: hacer que tu empresa consiga más clientes.',
}

export default function WhyUs() {
  const { data: settings } = useSettings('whyus')
  const reasons = settings?.reasons || defaultReasons
  const heading = settings?.heading || defaultWhyUs.heading
  const headingHighlight = settings?.headingHighlight || defaultWhyUs.headingHighlight
  const subtitle = settings?.subtitle || defaultWhyUs.subtitle
  const badge = settings?.badge || defaultWhyUs.badge

  return (
    <section className="relative overflow-hidden bg-brand-secondary py-20 sm:py-28">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-brand-primary blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-brand-accent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-accent">
            {badge}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {heading} <span className="text-brand-accent">{headingHighlight}</span>
          </h2>
          <p className="mt-4 text-lg text-slate-300">{subtitle}</p>
        </ScrollReveal>

        <ScrollReveal stagger={0.1} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => {
            const Icon = resolveIcon(reason.icon) || TrendingUp
            return (
              <div
                key={i}
                className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/10"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-glow transition-transform duration-500 group-hover:scale-110">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">{reason.title}</h3>
                <p className="mb-6 text-sm leading-relaxed text-slate-300">{reason.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-brand-accent">{reason.metric}</span>
                  <span className="text-sm text-slate-400">{reason.metricLabel}</span>
                </div>
              </div>
            )
          })}
        </ScrollReveal>
      </div>
    </section>
  )
}
