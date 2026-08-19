import { Globe, Check } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import { useApi } from '../lib/useApi'
import { useSettings } from '../lib/useSettings'
import { resolveIcon } from '../lib/icons'

const defaultServices = {
  badge: 'Servicios',
  heading: 'Soluciones que hacen crecer tu ',
  headingHighlight: 'empresa',
  subtitle:
    'Cada servicio está diseñado con un objetivo: conseguir más clientes para tu negocio.',
}

export default function Services() {
  const { data: services } = useApi('services')
  const { data: settings } = useSettings('services_section')

  const badge = settings?.badge || defaultServices.badge
  const heading = settings?.heading || defaultServices.heading
  const headingHighlight = settings?.headingHighlight || defaultServices.headingHighlight
  const subtitle = settings?.subtitle || defaultServices.subtitle

  return (
    <section id="servicios" className="py-20 sm:py-28">
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

        <ScrollReveal stagger={0.1} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = resolveIcon(service.icon) || Globe
            return (
              <div
                key={service.id || i}
                className="group relative rounded-3xl border border-slate-100 bg-white p-8 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-card"
              >
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color || 'from-blue-500 to-blue-600'} shadow-glow transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-brand-secondary">{service.title}</h3>
                <p className="mb-6 text-sm leading-relaxed text-slate-500">{service.description}</p>
                <ul className="space-y-2">
                  {(Array.isArray(service.features) ? service.features : []).map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </ScrollReveal>
      </div>
    </section>
  )
}
