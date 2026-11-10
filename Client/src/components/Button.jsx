export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  onClick,
}) {
  const base =
    'w-full rounded-[var(--radius-md)] px-4 py-3 text-sm sm:text-base font-semibold cursor-pointer';
  const variantClass =
    variant === 'outline' ? 'glass-btn-outline' : 'glass-btn';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}
