import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;

  const config = {
    error: {
      container: 'bg-[var(--color-error-bg)] border-[var(--color-error-border)] text-[var(--color-error)]',
      icon: <AlertCircle className="w-4 h-4 text-[var(--color-error)] shrink-0 mt-0.5" />,
    },
    success: {
      container: 'bg-[var(--color-success-bg)] border-[var(--color-success-border)] text-[var(--color-success)]',
      icon: <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] shrink-0 mt-0.5" />,
    },
    warning: {
      container: 'bg-[var(--color-warning-bg)] border-[var(--color-warning-border)] text-[var(--color-warning)]',
      icon: <AlertTriangle className="w-4 h-4 text-[var(--color-warning)] shrink-0 mt-0.5" />,
    },
    info: {
      container: 'bg-[var(--pill-accent-bg)] border-[var(--input-border)] text-[var(--text-accent)]',
      icon: <Info className="w-4 h-4 text-[var(--text-accent)] shrink-0 mt-0.5" />,
    },
  }[type] || {
    container: 'bg-[var(--color-error-bg)] border-[var(--color-error-border)] text-[var(--color-error)]',
    icon: <AlertCircle className="w-4 h-4 text-[var(--color-error)] shrink-0 mt-0.5" />,
  };

  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs leading-relaxed transition-all animate-fade-in ${config.container}`}
    >
      {config.icon}
      <div className="flex-1 font-medium">{message}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="opacity-60 hover:opacity-100 transition-opacity p-0.5"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
