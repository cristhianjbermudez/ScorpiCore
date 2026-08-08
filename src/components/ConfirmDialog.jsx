import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  danger = true,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-secondary/30 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-sm glass rounded-3xl border border-white/20 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex justify-center">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-md ${danger ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-brand-primary to-blue-600'}`}
          >
            <AlertTriangle className="h-7 w-7 text-white" />
          </div>
        </div>
        <h3 id="confirm-title" className="mb-2 text-center text-lg font-bold text-brand-secondary">
          {title}
        </h3>
        <p className="mb-6 text-center text-sm text-slate-500">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 ${danger ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-red-500/30' : 'btn-primary'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
