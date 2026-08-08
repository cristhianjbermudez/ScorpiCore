import { useEffect, useRef } from 'react'
import { ArrowRight, Zap, TrendingUp, BarChart3, Calendar, Phone } from 'lucide-react'
import { gsap } from 'gsap'
import Particles from '../components/Particles'
import { useSettings } from '../lib/useSettings'

const defaultStats = [
  { value: '120+', label: 'Proyectos entregados' },
  { value: '80+', label: 'Clientes que crecieron' },
  { value: '7 días', label: 'Tu landing lista' },
  { value: '<2h', label: 'Respuesta garantizada' },
]

const defaultDashboard = {
  chartBars: [40, 55, 45, 70, 60, 85, 75, 90, 80, 95, 88, 100],
  stats: [
    { label: 'Tráfico', value: '12.4k' },
    { label: 'Ventas', value: '3.8k' },
    { label: 'ROI', value: '340%' },
  ],
  floatCards: [
    { label: 'Tiempo de carga', value: '0.8', unit: 'seg' },
    { label: '+42%', sublabel: 'conversión' },
    { score: '100/100', sublabel: 'Lighthouse Score' },
  ],
}

function DashboardMockup({ dashboard }) {
  const d = dashboard || defaultDashboard
  return (
    <div className="relative hidden lg:block">
      <div className="glass rounded-3xl border border-white/20 p-6 shadow-2xl shadow-brand-primary/10">
        {/* Browser dots */}
        <div className="mb-4 flex gap-2">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        {/* Chart bars */}
        <div className="mb-6 flex items-end gap-3 h-40">
          {(d.chartBars || defaultDashboard.chartBars).map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-lg bg-gradient-to-t from-brand-primary to-brand-accent"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {(d.stats || defaultDashboard.stats).map((s, i) => (
            <div key={i} className="rounded-xl bg-white/60 p-3 text-center">
              <div className="text-xs text-slate-500">{s.label}</div>
              <div className="text-lg font-bold text-brand-secondary">{s.value}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Floating cards */}
      {(d.floatCards || defaultDashboard.floatCards)[0] && (
        <div className="absolute -right-4 top-8 rounded-2xl bg-white px-4 py-3 shadow-lg">
          <div className="text-xs text-slate-500">
            {(d.floatCards || defaultDashboard.floatCards)[0].label}
          </div>
          <div className="text-2xl font-bold text-brand-secondary">
            {(d.floatCards || defaultDashboard.floatCards)[0].value}{' '}
            <span className="text-sm font-normal">
              {(d.floatCards || defaultDashboard.floatCards)[0].unit}
            </span>
          </div>
        </div>
      )}
      {(d.floatCards || defaultDashboard.floatCards)[1] && (
        <div className="absolute -left-4 bottom-16 rounded-2xl bg-white px-4 py-3 shadow-lg">
          <div className="text-xs text-slate-500">
            {(d.floatCards || defaultDashboard.floatCards)[1].label}
          </div>
          <div className="text-xs text-slate-400">
            {(d.floatCards || defaultDashboard.floatCards)[1].sublabel}
          </div>
        </div>
      )}
      {(d.floatCards || defaultDashboard.floatCards)[2] && (
        <div className="absolute -left-8 bottom-0 rounded-2xl bg-white px-4 py-3 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Zap className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-brand-secondary">
                {(d.floatCards || defaultDashboard.floatCards)[2].score}
              </div>
              <div className="text-xs text-slate-500">
                {(d.floatCards || defaultDashboard.floatCards)[2].sublabel}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Hero() {
  const sectionRef = useRef(null)
  const { data: settings } = useSettings('hero')

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.set(el.querySelectorAll('[data-hero]'), { opacity: 0, y: 30 })

    tl.to(el.querySelectorAll('[data-hero]'), {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      delay: 0.2,
    })
  }, [])

  const badge = settings?.badge || 'Agencia de desarrollo web premium'
  const heading = settings?.heading || 'Tu negocio merece una presencia digital que genere '
  const headingHighlight = settings?.headingHighlight || 'clientes'
  const subtitle =
    settings?.subtitle ||
    'Diseñamos páginas web y software que no solo se ven bien: convierten visitantes en clientes reales. Cada proyecto está optimizado para hacer crecer tu empresa.'
  const ctaPrimary = settings?.ctaPrimary || 'Ver cómo trabajamos'
  const ctaSecondary = settings?.ctaSecondary || 'Agendar llamada gratuita'
  const ctaPrimaryHref = settings?.ctaPrimaryHref || '#portafolio'
  const ctaSecondaryHref = settings?.ctaSecondaryHref || '#contacto'
  const stats = settings?.stats || defaultStats

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen overflow-hidden gradient-mesh pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      <Particles />
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-brand-primary/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="max-w-xl">
            <div
              data-hero
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-4 py-1.5 text-sm font-medium text-brand-primary"
            >
              <Zap className="h-4 w-4" />
              {badge}
            </div>

            <h1
              data-hero
              className="text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-secondary sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              {heading}
              <span className="gradient-text">{headingHighlight}</span>{' '}
            </h1>

            <p data-hero className="mt-6 text-lg text-slate-600 leading-relaxed">
              {subtitle}
            </p>

            <div data-hero className="mt-8 flex flex-wrap gap-4">
              <a href={ctaSecondaryHref} className="btn-primary">
                <Calendar className="h-4 w-4" />
                {ctaSecondary}
              </a>
              <a
                href={ctaPrimaryHref}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-brand-secondary hover:border-brand-primary hover:text-brand-primary transition-colors"
              >
                {ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div data-hero className="mt-16 flex gap-10">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-brand-secondary">{stat.value}</div>
                  <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard mockup */}
          <div data-hero>
            <DashboardMockup dashboard={settings?.dashboard} />
          </div>
        </div>
      </div>
    </section>
  )
}
