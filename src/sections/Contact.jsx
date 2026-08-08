import { useState, useEffect } from 'react'
import { Send, MessageCircle, Mail, Phone, Calendar } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import { api } from '../lib/api'
import { useSettings } from '../lib/useSettings'
import { useToast } from '../components/Toast'
import { config } from '../config'

const defaultProjectTypes = [
  'Landing Page',
  'Sitio Web Corporativo',
  'Software a Medida',
  'E-commerce / Tienda Online',
  'Automatización de Procesos',
  'Otro',
]

const defaultBudgets = [
  'Menos de $1,000',
  '$1,000 - $3,000',
  '$3,000 - $10,000',
  '$10,000 - $25,000',
  'Más de $25,000',
]

const defaultContact = {
  badge: 'Solicitar cotización',
  heading: 'Cuéntanos tu ',
  headingHighlight: 'proyecto',
  subtitle:
    'Cuéntanos qué necesitas y te enviaremos una propuesta personalizada en menos de 24 horas. Sin compromiso, sin costo.',
  guaranteeText: 'Respuesta en menos de 24 horas — Cotización gratuita — Sin compromiso',
}

export default function Contact() {
  const { data: settings } = useSettings('contact')
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    plan: '',
    description: '',
  })
  const [status, setStatus] = useState('idle')
  const toast = useToast()

  useEffect(() => {
    const handler = (e) => setForm((prev) => ({ ...prev, plan: e.detail }))
    window.addEventListener('planSelected', handler)
    return () => window.removeEventListener('planSelected', handler)
  }, [])

  const projectTypes = settings?.projectTypes || defaultProjectTypes
  const budgets = settings?.budgets || defaultBudgets
  const heading = settings?.heading || defaultContact.heading
  const headingHighlight = settings?.headingHighlight || defaultContact.headingHighlight
  const subtitle = settings?.subtitle || defaultContact.subtitle
  const badge = settings?.badge || defaultContact.badge
  const whatsappHref =
    settings?.whatsapp ||
    `${config.whatsapp.link}?text=Hola%20ScorpiCore%2C%20me%20gustar%C3%ADa%20solicitar%20una%20cotizaci%C3%B3n%20para%20un%20proyecto.`
  const emailHref = settings?.email || `mailto:${config.contact.email}`
  const emailLabel = settings?.emailLabel || config.contact.email
  const phoneHref = settings?.phone || config.contact.phoneHref
  const phoneLabel = settings?.phoneLabel || config.contact.phone
  const guaranteeText = settings?.guaranteeText || defaultContact.guaranteeText

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await api.contact({
        name: form.name,
        company: form.company,
        email: form.email,
        phone: form.phone,
        project_type: form.projectType,
        budget: form.budget,
        plan: form.plan,
        description: form.description,
      })
      setStatus('success')
      toast.success('¡Mensaje enviado! Te contactaremos en menos de 24 horas.')
      setForm({
        name: '',
        company: '',
        email: '',
        phone: '',
        projectType: '',
        budget: '',
        plan: '',
        description: '',
      })
    } catch (err) {
      setStatus('error')
      toast.error('Ocurrió un error. Por favor intenta de nuevo o escríbenos por WhatsApp.')
    }
  }

  return (
    <section id="contacto" className="py-20 sm:py-28">
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

        <div className="mt-16 grid gap-12 lg:grid-cols-5">
          <ScrollReveal className="space-y-6 lg:col-span-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-green-500/30 hover:shadow-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 transition-transform duration-300 group-hover:scale-110">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-brand-secondary">
                  Contactar por WhatsApp
                </div>
                <div className="text-xs text-slate-400">Respuesta inmediata</div>
              </div>
            </a>

            <a
              href={emailHref}
              className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 transition-transform duration-300 group-hover:scale-110">
                <Mail className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-brand-secondary">{emailLabel}</div>
                <div className="text-xs text-slate-400">Escríbenos tu proyecto</div>
              </div>
            </a>

            <a
              href={phoneHref}
              className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent/30 hover:shadow-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-accent/10 transition-transform duration-300 group-hover:scale-110">
                <Phone className="h-5 w-5 text-brand-accent" />
              </div>
              <div>
                <div className="text-sm font-semibold text-brand-secondary">{phoneLabel}</div>
                <div className="text-xs text-slate-400">Habla directamente con nosotros</div>
              </div>
            </a>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 transition-transform duration-300 group-hover:scale-110">
                <Calendar className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-brand-secondary">
                  Agendar una llamada
                </div>
                <div className="text-xs text-slate-400">30 min gratuitos, sin compromiso</div>
              </div>
            </a>

            <div className="rounded-2xl bg-brand-primary/5 p-5 text-center">
              <p className="text-sm font-medium text-brand-primary">{guaranteeText}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft"
            >
              {form.plan && (
                <div className="mb-6 flex items-center justify-between rounded-xl border border-brand-primary/20 bg-brand-primary/5 px-4 py-3">
                  <span className="text-sm text-slate-600">Plan seleccionado:</span>
                  <span className="text-sm font-bold text-brand-primary">{form.plan}</span>
                </div>
              )}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1.5 block text-sm font-medium text-brand-secondary"
                  >
                    Nombre *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-company"
                    className="mb-1.5 block text-sm font-medium text-brand-secondary"
                  >
                    Empresa
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Nombre de tu empresa"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1.5 block text-sm font-medium text-brand-secondary"
                  >
                    Correo *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tu@empresa.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="mb-1.5 block text-sm font-medium text-brand-secondary"
                  >
                    Teléfono
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+57 300 123 4567"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-project"
                    className="mb-1.5 block text-sm font-medium text-brand-secondary"
                  >
                    Tipo de proyecto *
                  </label>
                  <select
                    id="contact-project"
                    name="projectType"
                    required
                    value={form.projectType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  >
                    <option value="">Selecciona...</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="contact-budget"
                    className="mb-1.5 block text-sm font-medium text-brand-secondary"
                  >
                    Presupuesto
                  </label>
                  <select
                    id="contact-budget"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  >
                    <option value="">Selecciona...</option>
                    {budgets.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-brand-secondary">
                  Descripción del proyecto *
                </label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Cuéntanos sobre tu proyecto, objetivos y requisitos..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary mt-6 w-full disabled:opacity-60"
              >
                {status === 'sending' ? (
                  'Enviando...'
                ) : (
                  <>
                    Enviar solicitud
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
