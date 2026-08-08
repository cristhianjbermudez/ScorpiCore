import { useState, useEffect } from 'react'
import { Menu, X, ChevronRight } from 'lucide-react'
import { useSettings } from '../lib/useSettings'

const defaultNav = {
  links: [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Proceso', href: '#proceso' },
    { label: 'Portafolio', href: '#portafolio' },
    { label: 'Planes', href: '#planes' },
    { label: 'FAQ', href: '#faq' },
  ],
  cta: 'Solicitar Cotización',
  ctaHref: '#contacto',
}

export default function Navbar({ onAdmin }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: settings } = useSettings('navbar')

  const navLinks = settings?.links || defaultNav.links
  const cta = settings?.cta || defaultNav.cta
  const ctaHref = settings?.ctaHref || defaultNav.ctaHref

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-soft py-3' : 'py-5'}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        <a href="#hero" className="flex items-center gap-2 text-xl font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-blue-700 text-white font-bold text-lg">
            S
          </div>
          <span>
            <span className="text-brand-secondary">Scorpi</span>
            <span className="gradient-text">Core</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-primary"
            >
              {link.label}
            </a>
          ))}
          <a href={ctaHref} className="btn-primary">
            {cta}
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded-xl lg:hidden"
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-all duration-500 lg:hidden ${mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-semibold text-brand-secondary transition-colors hover:text-brand-primary"
            >
              {link.label}
            </a>
          ))}
          <a href={ctaHref} onClick={() => setMobileOpen(false)} className="btn-primary mt-4">
            {cta}
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </nav>
  )
}
