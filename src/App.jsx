import { useState, useEffect, Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import WhatsAppButton from './components/WhatsAppButton'
import ErrorBoundary from './components/ErrorBoundary'

const Hero = lazy(() => import('./sections/Hero'))
const Services = lazy(() => import('./sections/Services'))
const WhyUs = lazy(() => import('./sections/WhyUs'))
const Process = lazy(() => import('./sections/Process'))
const Portfolio = lazy(() => import('./sections/Portfolio'))
const Technologies = lazy(() => import('./sections/Technologies'))
const Pricing = lazy(() => import('./sections/Pricing'))
const Testimonials = lazy(() => import('./sections/Testimonials'))
const FAQ = lazy(() => import('./sections/FAQ'))
const Contact = lazy(() => import('./sections/Contact'))
const Footer = lazy(() => import('./sections/Footer'))
const Admin = lazy(() => import('./pages/Admin'))
const LegalPage = lazy(() => import('./pages/LegalPage'))

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
    </div>
  )
}

function NotFound({ onNavigate }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="glass flex flex-col items-center rounded-3xl border border-white/20 p-10 shadow-xl">
        <div className="mb-6 text-7xl font-extrabold text-brand-primary">404</div>
        <h2 className="text-xl font-bold text-brand-secondary">Página no encontrada</h2>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          La página que buscas no existe o fue movida. Vuelve al inicio para continuar navegando.
        </p>
        <button onClick={onNavigate} className="btn-primary mt-6">
          Volver al inicio
        </button>
      </div>
    </div>
  )
}

function LandingPage({ onNavigate }) {
  return (
    <>
      <Navbar onAdmin={() => onNavigate('admin')} />
      <main>
        <Suspense fallback={<SectionLoader />}>
          <Hero />
          <Services />
          <WhyUs />
          <Process />
          <Portfolio />
          <Technologies />
          <Pricing />
          <Testimonials />
          <FAQ />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <WhatsAppButton />
    </>
  )
}

const SECTION_IDS = ['hero', 'portafolio', 'contacto', 'servicios', 'proceso', 'precios', 'testimonios', 'faq']

function getHash() {
  const raw = window.location.hash.replace('#', '').replace('/', '') || 'home'
  if (SECTION_IDS.includes(raw)) return 'home'
  return raw
}

export default function App() {
  const [page, setPage] = useState(getHash)

  useEffect(() => {
    const onHashChange = () => setPage(getHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (page === 'admin' || page === 'privacidad' || page === 'terminos') {
      window.scrollTo(0, 0)
    }
  }, [page])

  useEffect(() => {
    const raw = window.location.hash.replace('#', '').replace('/', '')
    if (SECTION_IDS.includes(raw) && raw !== 'hero') {
      requestAnimationFrame(() => {
        document.getElementById(raw)?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [page])

  const goHome = () => {
    window.location.hash = ''
  }

  if (page === 'admin') {
    return (
      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}>
          <Admin onBack={goHome} />
        </Suspense>
      </ErrorBoundary>
    )
  }

  if (page === 'privacidad') {
    return (
      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}>
          <LegalPage type="privacidad" onBack={goHome} />
        </Suspense>
      </ErrorBoundary>
    )
  }

  if (page === 'terminos') {
    return (
      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}>
          <LegalPage type="terminos" onBack={goHome} />
        </Suspense>
      </ErrorBoundary>
    )
  }

  if (page !== 'home') {
    return (
      <ErrorBoundary>
        <NotFound onNavigate={goHome} />
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <LandingPage
        onNavigate={(p) => {
          window.location.hash = p
        }}
      />
    </ErrorBoundary>
  )
}
