import { ArrowRight } from 'lucide-react'
import { useSettings } from '../lib/useSettings'
import { config } from '../config'

const defaultFooter = {
  heading: '¿Listo para hacer crecer tu negocio?',
  ctaPrimary: 'Solicitar propuesta',
  ctaSecondary: 'Ver ejemplos',
  ctaPrimaryHref: '#contacto',
  ctaSecondaryHref: '#portafolio',
  description:
    'Creamos páginas web y software que generan clientes reales. Landing pages, sitios corporativos, tiendas online y soluciones a medida.',
  links: {
    empresa: [
      { label: 'Inicio', href: '#hero' },
      { label: 'Servicios', href: '#servicios' },
      { label: 'Portafolio', href: '#portafolio' },
      { label: 'Planes y precios', href: '#planes' },
    ],
    recursos: [
      { label: 'Cómo trabajamos', href: '#proceso' },
      { label: 'Preguntas frecuentes', href: '#faq' },
      { label: 'Contacto', href: '#contacto' },
    ],
  },
  social: [
    { label: 'WhatsApp', href: config.whatsapp.link },
    { label: 'Email', href: `mailto:${config.contact.email}` },
  ],
  privacyLabel: 'Política de Privacidad',
  termsLabel: 'Términos de Servicio',
  adminLabel: 'Admin',
}

export default function Footer() {
  const { data: settings } = useSettings('footer')
  const heading = settings?.heading || defaultFooter.heading
  const ctaPrimary = settings?.ctaPrimary || defaultFooter.ctaPrimary
  const ctaSecondary = settings?.ctaSecondary || defaultFooter.ctaSecondary
  const ctaPrimaryHref = settings?.ctaPrimaryHref || defaultFooter.ctaPrimaryHref
  const ctaSecondaryHref = settings?.ctaSecondaryHref || defaultFooter.ctaSecondaryHref
  const description = settings?.description || defaultFooter.description
  const links = settings?.links || defaultFooter.links
  const social = settings?.social || defaultFooter.social
  const privacyLabel = settings?.privacyLabel || defaultFooter.privacyLabel
  const termsLabel = settings?.termsLabel || defaultFooter.termsLabel
  const adminLabel = settings?.adminLabel || defaultFooter.adminLabel

  return (
    <footer className="bg-brand-secondary pb-28 pt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* CTA Banner */}
        <div className="mb-16 rounded-3xl bg-gradient-to-br from-brand-primary to-brand-accent p-12 text-center shadow-glow">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{heading}</h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href={ctaPrimaryHref}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-semibold text-brand-primary shadow-lg transition-all duration-300 hover:scale-[1.03]"
            >
              {ctaPrimary}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={ctaSecondaryHref}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
            >
              {ctaSecondary}
            </a>
          </div>
        </div>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#hero" className="flex items-center gap-1 text-xl font-bold">
              <span className="text-white">Scorpi</span>
              <span className="text-brand-accent">Core</span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">{description}</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Empresa</h3>
            <ul className="space-y-2">
              {(links.empresa || []).map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-brand-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Recursos</h3>
            <ul className="space-y-2">
              {(links.recursos || []).map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-brand-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} ScorpiCore. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            {(social || []).map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-xs text-slate-500 transition-colors hover:text-brand-accent"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#privacidad"
              className="text-xs text-slate-500 transition-colors hover:text-brand-accent"
            >
              {privacyLabel}
            </a>
            <a
              href="#terminos"
              className="text-xs text-slate-500 transition-colors hover:text-brand-accent"
            >
              {termsLabel}
            </a>
            <a
              href="#admin"
              className="text-xs text-slate-500 transition-colors hover:text-brand-accent"
            >
              {adminLabel}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
