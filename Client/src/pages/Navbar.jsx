import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Layers, LogOut, PlusCircle, FileText, Sun, Moon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out.');
      navigate('/login');
    } catch {
      toast.error('Logout error');
    }
  };

  return (
    <nav className="w-full bg-[var(--card-bg)] border-b border-[var(--card-border)] sticky top-0 z-40 mb-6 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--pill-accent-bg)] flex items-center justify-center text-[var(--text-accent)] shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-[var(--text-primary)]">
            Noted<span className="text-[var(--text-accent)]">.</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="flex items-center gap-2 sm:gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[var(--pill-accent-bg)] text-[var(--text-accent)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--input-bg)]'
              }`
            }
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Note</span>
          </NavLink>

          <NavLink
            to="/pastes"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[var(--pill-accent-bg)] text-[var(--text-accent)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--input-bg)]'
              }`
            }
          >
            <FileText className="w-4 h-4" />
            <span>All Notes</span>
          </NavLink>
        </div>

        {/* Right Section: Theme Toggle & Auth */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-[var(--text-secondary)]" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-xs text-[var(--text-primary)]">
                <div className="w-5 h-5 rounded-md bg-[var(--btn-primary-bg)] text-white flex items-center justify-center font-bold text-[10px] uppercase">
                  {user?.username?.[0] || user?.email?.[0] || 'U'}
                </div>
                <span className="font-medium max-w-[120px] truncate">
                  {user?.username || user?.email?.split('@')[0] || 'User'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[var(--btn-primary-bg)] hover:opacity-90 shadow-sm transition-all active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
