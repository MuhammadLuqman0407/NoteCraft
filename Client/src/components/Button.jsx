import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  fullWidth = true,
  className = '',
  onClick,
}) {
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2.5 sm:py-3 text-sm',
    lg: 'px-5 py-3.5 text-base',
  }[size] || 'px-4 py-2.5 sm:py-3 text-sm';

  const variantClasses = {
    primary:
      'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:opacity-95 shadow-sm active:scale-[0.99] border border-transparent font-medium',
    secondary:
      'bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] border border-[var(--btn-secondary-border)] hover:bg-[var(--btn-secondary-hover)] active:scale-[0.99] font-medium',
    outline:
      'bg-transparent text-[var(--text-primary)] border border-[var(--card-border)] hover:bg-[var(--input-bg)] active:scale-[0.99]',
    ghost:
      'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--input-bg)]',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm active:scale-[0.99]',
  }[variant] || 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]';

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--input-border-focus)]/30 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed select-none ${
        fullWidth ? 'w-full' : ''
      } ${sizeClasses} ${variantClasses} ${className}`}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{typeof children === 'string' ? children : 'Please wait...'}</span>
        </span>
      ) : (
        <span className="inline-flex items-center justify-center gap-2">
          <span>{children}</span>
          {icon && <span className="shrink-0">{icon}</span>}
        </span>
      )}
    </button>
  );
}
