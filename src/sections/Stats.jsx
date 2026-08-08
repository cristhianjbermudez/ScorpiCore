import ScrollReveal from '../components/ScrollReveal'
import { CheckCircle, Users, Clock, Headphones } from 'lucide-react'
import { useSettings } from '../lib/useSettings'

const icons = [CheckCircle, Users, Clock, Headphones]

const defaultItems = [
  { value: '120+', label: 'Proyectos que generan resultados' },
  { value: '80+', label: 'Empresas que confiaron en nosotros' },
  { value: '7 días', label: 'Para tener tu landing page lista' },
  { value: '< 2h', label: 'Tiempo de respuesta garantizado' },
]

export default function Stats() {
  const { data: settings } = useSettings('stats')
  const items = settings?.items || defaultItems

  return (
    <section className="py-16 border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal stagger={0.1}>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {items.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10">
                  {(() => {
                    const I = icons[i] || icons[0]
                    return <I className="h-5 w-5 text-brand-primary" />
                  })()}
                </div>
                <div className="text-3xl font-bold text-brand-secondary">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
