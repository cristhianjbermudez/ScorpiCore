import { useState } from 'react'
import { ChevronDown, MessageCircle } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import { useApi } from '../lib/useApi'
import { useSettings } from '../lib/useSettings'
import { config } from '../config'

const defaultFaq = {
  badge: 'Dudas comunes',
  heading: 'Lo que más nos ',
  headingHighlight: 'preguntan',
  subtitle:
    'Respuestas claras para que tomes la mejor decisión. Si no encuentras lo que buscas, escríbenos por WhatsApp.',
  cta: 'Preguntar por WhatsApp',
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const { data: faqs } = useApi('faqs')
  const { data: settings } = useSettings('faq')

  const heading = settings?.heading || defaultFaq.heading
  const headingHighlight = settings?.headingHighlight || defaultFaq.headingHighlight
  const subtitle = settings?.subtitle || defaultFaq.subtitle
  const badge = settings?.badge || defaultFaq.badge
  const cta = settings?.cta || defaultFaq.cta
  const ctaHref =
    settings?.ctaHref ||
    `${config.whatsapp.link}?text=Hola%20ScorpiCore%2C%20tengo%20una%20pregunta`

  return (
    <section id="faq" className="bg-slate-50 py-20 sm:py-28">
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

        <ScrollReveal className="mx-auto mt-16 max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={faq.id || i}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="text-sm font-semibold text-brand-secondary">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                      openIndex === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  className={`grid transition-all duration-300 ${
                    openIndex === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-sm leading-relaxed text-slate-500">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-12 text-center">
          <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <MessageCircle className="h-4 w-4" />
            {cta}
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}
