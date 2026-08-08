import { ExternalLink } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import { useApi } from '../lib/useApi'

const gradients = [
  'from-blue-500/20 to-indigo-500/20',
  'from-violet-500/20 to-purple-500/20',
  'from-green-500/20 to-emerald-500/20',
  'from-orange-500/20 to-amber-500/20',
  'from-cyan-500/20 to-sky-500/20',
  'from-rose-500/20 to-pink-500/20',
]

const defaultImages = [
  'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1051075/pexels-photo-1051075.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/326545/pexels-photo-326545.jpeg?auto=compress&cs=tinysrgb&w=800',
]

export default function Portfolio() {
  const { data: projects } = useApi('projects')

  return (
    <section id="portafolio" className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-4 py-1.5 text-sm font-medium text-brand-primary">
            Nuestros trabajos
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-secondary sm:text-4xl lg:text-5xl">
            Proyectos que <span className="gradient-text">generan clientes reales</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Cada diseño tiene un objetivo: hacer crecer tu empresa. Estos son algunos de los
            resultados que hemos logrado junto a nuestros clientes.
          </p>
        </ScrollReveal>

        <ScrollReveal stagger={0.15} className="mt-16 grid gap-8 sm:grid-cols-2">
          {projects.map((project, i) => (
            <div
              key={project.id || i}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={project.image || defaultImages[i % defaultImages.length]}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${gradients[i % gradients.length]} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                    <ExternalLink className="h-5 w-5 text-brand-primary" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <span className="mb-2 inline-block rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium text-brand-primary">
                  {project.category}
                </span>
                <h3 className="mt-2 text-xl font-bold text-brand-secondary">{project.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{project.description}</p>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
