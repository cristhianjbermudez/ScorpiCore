import { Quote, MessageCircle, Star } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import { useApi } from '../lib/useApi'

export default function Testimonials() {
  const { data: testimonials } = useApi('testimonials')

  return (
    <section id="testimonios" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-4 py-1.5 text-sm font-medium text-brand-primary">
            Confianza comprobada
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-secondary sm:text-4xl lg:text-5xl">
            Empresas que ya <span className="gradient-text">confían en nosotros</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            La mejor forma de conocer nuestro trabajo es hablando directamente con nosotros.
            Cuéntanos tu proyecto y te mostraremos cómo podemos ayudarte.
          </p>
        </ScrollReveal>

        {testimonials.length > 0 ? (
          <ScrollReveal stagger={0.1} className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={t.id || i}
                className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-card"
              >
                <Quote className="h-8 w-8 text-brand-primary/20" />
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{t.content}</p>
                <div className="mt-4 flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, j) => (
                    <Star
                      key={j}
                      className={`h-4 w-4 ${j < (t.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-bold text-brand-primary">
                    {t.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-brand-secondary">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollReveal>
        ) : (
          <ScrollReveal className="mt-16">
            <div className="mx-auto max-w-md rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-soft">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
                <Quote className="h-8 w-8 text-brand-primary" />
              </div>
              <h3 className="text-lg font-semibold text-brand-secondary">
                ¿Quieres ver resultados reales?
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Agenda una llamada gratuita de 30 minutos y te mostramos casos de éxito similares a
                tu proyecto. Sin compromiso, sin costo.
              </p>
              <a
                href="#contacto"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Agendar llamada gratuita
              </a>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}
