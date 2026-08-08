import { useState, useEffect } from 'react'
import { Check, Star } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import { useApi } from '../lib/useApi'

export default function Pricing() {
  const { data: plans } = useApi('plans')
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    if (plans.length && !selectedId) {
      const popular = plans.find((p) => p.popular)
      if (popular) setSelectedId(popular.id)
    }
  }, [plans])

  const handleSelect = (plan) => {
    setSelectedId((prev) => (prev === plan.id ? null : plan.id))
  }

  const handleCotizar = (e, plan) => {
    e.stopPropagation()
    setSelectedId(plan.id)
    window.dispatchEvent(new CustomEvent('planSelected', { detail: plan.name }))
    const el = document.getElementById('contacto')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="planes" className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-4 py-1.5 text-sm font-medium text-brand-primary">
            Planes
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-secondary sm:text-4xl lg:text-5xl">
            Inversión clara, <span className="gradient-text">sin sorpresas</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Elige el plan que se ajuste a tu momento. Todos personalizables, todos orientados a
            generar resultados.
          </p>
        </ScrollReveal>

        <ScrollReveal stagger={0.1} className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => {
            const isSelected = selectedId === plan.id
            return (
              <div
                key={plan.id || i}
                onClick={() => handleSelect(plan)}
                className={`relative cursor-pointer rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 ${
                  isSelected
                    ? 'border-2 border-brand-primary bg-white shadow-glow scale-[1.02]'
                    : 'border border-slate-100 bg-white shadow-soft hover:shadow-card'
                }`}
              >
                {isSelected ? (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="rounded-full bg-green-500 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                      Seleccionado
                    </div>
                  </div>
                ) : plan.popular ? (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 rounded-full bg-brand-primary px-4 py-1 text-xs font-semibold text-white shadow-glow">
                      <Star className="h-3 w-3 fill-current" />
                      Popular
                    </div>
                  </div>
                ) : null}
                <h3 className="text-xl font-bold text-brand-secondary">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-2xl font-extrabold text-brand-primary">{plan.price}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {(Array.isArray(plan.features) ? plan.features : []).map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={(e) => handleCotizar(e, plan)}
                  className={`mt-8 block w-full text-center ${
                    isSelected ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  Solicitar propuesta
                </button>
              </div>
            )
          })}
        </ScrollReveal>
      </div>
    </section>
  )
}
