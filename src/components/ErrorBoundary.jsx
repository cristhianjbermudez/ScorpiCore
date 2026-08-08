import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <div className="glass flex flex-col items-center rounded-3xl border border-white/20 p-10 shadow-xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="mt-6 text-xl font-bold text-brand-secondary">Algo salió mal</h2>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              Ocurrió un error inesperado. Por favor, intenta de nuevo.
            </p>
            {this.state.error && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-2 font-mono text-xs text-red-600">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="btn-primary mt-6 inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Recargar página
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
