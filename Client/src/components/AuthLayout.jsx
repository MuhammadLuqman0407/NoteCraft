import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="auth-bg" aria-hidden="true">
        <div className="auth-bg__orb auth-bg__orb--1" />
        <div className="auth-bg__orb auth-bg__orb--2" />
        <div className="auth-bg__orb auth-bg__orb--3" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              AuthFlow
            </span>
          </Link>
        </div>

        <div className="glass rounded-[var(--radius-2xl)] p-8 sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>

        <nav className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-[var(--text-muted)]">
          <Link to="/login" className="auth-link">
            Login
          </Link>
          <span aria-hidden="true">·</span>
          <Link to="/register" className="auth-link">
            Register
          </Link>
          <span aria-hidden="true">·</span>
          <Link to="/verify-otp" className="auth-link">
            Verify OTP
          </Link>
        </nav>
      </div>
    </div>
  );
}
