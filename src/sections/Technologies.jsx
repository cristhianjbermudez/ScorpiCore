import ScrollReveal from '../components/ScrollReveal'
import { useSettings } from '../lib/useSettings'

const defaultItems = [
  { name: 'Node.js', initial: 'N', color: 'text-green-600', bg: 'bg-green-50' },
  { name: 'Spring', initial: 'S', color: 'text-green-600', bg: 'bg-green-50' },
  { name: 'Laravel', initial: 'L', color: 'text-red-500', bg: 'bg-red-50' },
  { name: 'React', initial: 'R', color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Vue', initial: 'V', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Next.js', initial: 'N', color: 'text-slate-800', bg: 'bg-slate-100' },
  { name: 'Docker', initial: 'D', color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'PostgreSQL', initial: 'P', color: 'text-blue-700', bg: 'bg-blue-50' },
  { name: 'MySQL', initial: 'M', color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'MongoDB', initial: 'M', color: 'text-green-700', bg: 'bg-green-50' },
  { name: 'AWS', initial: 'A', color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Hostinger', initial: 'H', color: 'text-purple-600', bg: 'bg-purple-50' },
]

const defaultTechnologies = {
  badge: 'Tecnología',
  heading: 'Herramientas probadas, ',
  headingHighlight: 'resultados garantizados',
  subtitle:
    'Usamos las mismas tecnologías que las grandes empresas del mundo. No experimentamos con tu negocio: usamos lo que funciona.',
}

export default function Technologies() {
  const { data: settings } = useSettings('technologies')
  const items = settings?.items || defaultItems
  const heading = settings?.heading || defaultTechnologies.heading
  const headingHighlight = settings?.headingHighlight || defaultTechnologies.headingHighlight
  const subtitle = settings?.subtitle || defaultTechnologies.subtitle
  const badge = settings?.badge || defaultTechnologies.badge

  return (
    <section className="py-20 sm:py-28">
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

        <ScrollReveal
          stagger={0.08}
          className="mt-16 flex flex-wrap items-center justify-center gap-4"
        >
          {items.map((tech, i) => (
            <div
              key={i}
              className={`group flex items-center gap-3 rounded-2xl ${tech.bg} px-6 py-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${tech.color} font-bold`}
              >
                {tech.initial}
              </span>
              <span className="text-sm font-medium text-slate-700">{tech.name}</span>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
