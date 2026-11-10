export default function FormInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  maxLength,
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--text-secondary)]"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className="glass-input w-full rounded-[var(--radius-md)] px-4 py-3 text-sm sm:text-base"
      />
    </div>
  );
}
