import { forwardRef } from 'react';

const FormInput = forwardRef(function FormInput(
  {
    label,
    id,
    type = 'text',
    value,
    onChange,
    onBlur,
    placeholder,
    required = false,
    autoComplete,
    maxLength,
    error,
    hint,
    rightAction = null,
    icon = null,
    rightElement = null,
    disabled = false,
    className = '',
    ...props
  },
  ref
) {
  return (
    <div className="space-y-1.5 text-left w-full">
      {(label || hint || rightAction) && (
        <div className="flex items-center justify-between text-xs">
          {label && (
            <label
              htmlFor={id}
              className="font-medium text-[var(--text-secondary)] select-none"
            >
              {label}
              {required && <span className="text-[var(--text-accent)] ml-0.5">*</span>}
            </label>
          )}

          {/* Right hint or actionable link (like "Forgot PIN?", "Work or personal", etc.) */}
          {rightAction ? (
            <div>{rightAction}</div>
          ) : hint && !error ? (
            <span className="text-[var(--text-muted)] text-[11px]">{hint}</span>
          ) : null}
        </div>
      )}

      <div className="relative rounded-xl">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          maxLength={maxLength}
          disabled={disabled}
          className={`w-full rounded-xl bg-[var(--input-bg)] border text-[var(--input-text)] placeholder-[var(--input-placeholder)] text-sm transition-all duration-150 outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
            icon ? 'pl-10' : 'pl-3.5'
          } ${rightElement ? 'pr-10' : 'pr-3.5'} py-2.5 sm:py-3 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-[var(--input-border)] focus:bg-[var(--input-bg-focus)] focus:border-[var(--input-border-focus)] focus:ring-1 focus:ring-[var(--input-border-focus)]'
          } ${className}`}
          {...props}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1 animate-fade-in">
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});

export default FormInput;
