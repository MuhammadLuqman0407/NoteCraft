import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Lock, ShieldCheck, UserPlus, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AuthLayout({
  children,
  badge = 'WORKSPACE ACCESS',
  title,
  subtitle,
  activeTab = 'signin', // 'signin' | 'signup' | 'otp'
}) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Tabs for the segmented switcher
  const tabs = [
    {
      id: 'signin',
      label: 'Sign In',
      path: '/login',
      icon: <Lock className="w-3.5 h-3.5" />,
    },
    {
      id: 'signup',
      label: 'Sign Up',
      path: '/register',
      icon: <UserPlus className="w-3.5 h-3.5" />,
    },
    {
      id: 'otp',
      label: 'Two-Factor OTP',
      path: '/verify-otp',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      
      {/* Outer Card Window Container */}
      <div className="w-full max-w-[480px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden transition-all duration-200">
        
        {/* Window Top Bar (Mac dots + Brand + Theme toggle) */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-[var(--card-border)]/60">
          
          {/* macOS Window Controls */}
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block shadow-sm"
              style={{ backgroundColor: 'var(--dot-red)' }}
              title="Close window"
            />
            <span
              className="w-3 h-3 rounded-full inline-block shadow-sm"
              style={{ backgroundColor: 'var(--dot-yellow)' }}
              title="Minimize window"
            />
            <span
              className="w-3 h-3 rounded-full inline-block shadow-sm"
              style={{ backgroundColor: 'var(--dot-green)' }}
              title="Expand window"
            />
          </div>

          {/* Right Brand & Theme Switcher */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Pill */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-accent)] transition-all"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>

            {/* Brand Logo & Wordmark */}
            <Link
              to="/"
              className="flex items-center gap-1.5 group select-none"
              title="Return to NoteCraft"
            >
              <div className="w-5 h-5 rounded-md flex items-center justify-center text-[var(--text-accent)]">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
                Noted<span className="text-[var(--text-accent)]">.</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Card Content Area */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Segmented Pill Tabs Switcher */}
          <div className="bg-[var(--tab-container-bg)] p-1 rounded-xl flex items-center gap-1 select-none">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  state={location.state}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-[var(--tab-active-bg)] text-[var(--tab-active-text)] shadow-sm'
                      : 'text-[var(--tab-inactive-text)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className={isActive ? 'text-[var(--tab-active-text)]' : 'opacity-70'}>
                    {tab.icon}
                  </span>
                  <span className="truncate">{tab.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Section Heading & Category Badge */}
          <div className="space-y-1 text-left">
            {badge && (
              <span className="block text-[10px] font-bold tracking-wider text-[var(--text-accent)] uppercase">
                {badge}
              </span>
            )}
            <h1 className="text-2xl sm:text-[26px] font-bold text-[var(--text-primary)] tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          {children}

        </div>

      </div>

      {/* Footer Navigation */}
      <footer className="mt-6 text-center text-xs text-[var(--text-muted)] select-none">
        <p>
          NoteCraft Workspace • Serene knowledge base & notes
        </p>
      </footer>
    </div>
  );
}
