import { useState, useCallback, createContext, useContext, useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react'

const ToastContext = createContext(null)

let toastId = 0

const TOAST_STYLES = {
  success: {
    bg: 'bg-emerald-50 border-emerald-200',
    icon: CheckCircle,
    iconColor: 'text-emerald-500',
    progress: 'bg-emerald-500',
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-500',
    progress: 'bg-red-500',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    progress: 'bg-amber-500',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: Info,
    iconColor: 'text-blue-500',
    progress: 'bg-blue-500',
  },
}

function ToastItem({ toast, onRemove }) {
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info
  const Icon = style.icon

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 4000)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border ${style.bg} p-4 shadow-lg backdrop-blur-xl animate-slide-in`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${style.iconColor}`} />
      <div className="flex-1 min-w-0">
        {toast.title && <p className="text-sm font-semibold text-brand-secondary">{toast.title}</p>}
        <p className="text-sm text-slate-600">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/50 hover:text-slate-600"
      >
        <X className="h-4 w-4" />
      </button>
      <div
        className="absolute bottom-0 left-0 h-0.5 rounded-full opacity-30"
        style={{ background: style.progress }}
      />
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', options = {}) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type, ...options }])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = {
    success: (msg, opts) => addToast(msg, 'success', opts),
    error: (msg, opts) => addToast(msg, 'error', opts),
    warning: (msg, opts) => addToast(msg, 'warning', opts),
    info: (msg, opts) => addToast(msg, 'info', opts),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
