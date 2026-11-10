export default function Alert({ type = 'error', message }) {
  if (!message) return null;

  const typeClass =
    type === 'success'
      ? 'alert-success'
      : type === 'warning'
        ? 'alert-warning'
        : 'alert-error';

  return (
    <div
      role="alert"
      className={`${typeClass} rounded-[var(--radius-md)] px-4 py-3 text-sm`}
    >
      {message}
    </div>
  );
}
