import { useState, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Eye, EyeOff, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, setPendingEmail } = useAuth();
  const rememberId = useId();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot PIN/Password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleFillDemo = () => {
    setEmail('elena.rostova@noted.app');
    setPassword('supersecretpassphrase');
    setError('');
    toast.success('Loaded demo credentials!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your passphrase or PIN.');
      return;
    }

    setLoading(true);

    try {
      await login({ email: email.trim().toLowerCase(), password });
      toast.success('Welcome back to your workspace!');
      navigate('/');
    } catch (err) {
      if (err.message === 'Email not verified') {
        setPendingEmail(email.trim().toLowerCase());
        toast('Two-factor OTP required for this account.', { icon: '🛡️' });
        navigate('/verify-otp', { state: { email: email.trim().toLowerCase() } });
        return;
      }
      setError(err.message || 'Invalid email or passphrase. Please recheck your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyClick = () => {
    toast('Passkey authentication simulated. You can also use Quick Demo Fill.', {
      icon: '👤',
    });
    handleFillDemo();
  };

  const handleGitHubClick = () => {
    toast('GitHub OAuth connection is in placeholder mode.', {
      icon: '🐙',
    });
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error('Please enter your email.');
      return;
    }
    toast.success(`Recovery link dispatched to ${forgotEmail}`);
    setShowForgotModal(false);
  };

  return (
    <AuthLayout
      activeTab="signin"
      badge="WORKSPACE ACCESS"
      title="Log in to Noted"
      subtitle="Access your serene knowledge base and offline notebooks."
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5 text-left">
        <Alert type="error" message={error} onClose={() => setError('')} />

        {/* Email Address */}
        <FormInput
          label="Email Address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="elena.rostova@noted.app"
          required
          autoComplete="email"
          hint="Work or personal"
          icon={<Mail className="w-4 h-4" />}
        />

        {/* Passphrase / Master PIN */}
        <FormInput
          label="Passphrase / Master PIN"
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="supersecretpassphrase"
          required
          autoComplete="current-password"
          icon={<KeyRound className="w-4 h-4" />}
          rightAction={
            <button
              type="button"
              onClick={() => {
                setForgotEmail(email);
                setShowForgotModal(true);
              }}
              className="text-[var(--text-accent)] hover:underline text-xs font-semibold cursor-pointer"
            >
              Forgot PIN?
            </button>
          }
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded"
              aria-label={showPassword ? 'Hide passphrase' : 'Show passphrase'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        {/* Remember device row */}
        <div className="flex items-center justify-between text-xs pt-1 select-none">
          <label htmlFor={rememberId} className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              id={rememberId}
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--input-border)] bg-[var(--input-bg)] accent-[var(--color-primary)] cursor-pointer"
            />
            <span className="text-[var(--text-secondary)] font-medium">
              Remember this trusted device
            </span>
          </label>

          {/* 30 Days pill */}
          <span className="px-2 py-0.5 rounded-md bg-[var(--pill-bg)] text-[var(--pill-text)] text-[11px] font-semibold tracking-wide">
            30 Days
          </span>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            icon={<ArrowRight className="w-4 h-4 ml-1" />}
          >
            {loading ? 'Authenticating...' : 'Continue to Notes'}
          </Button>
        </div>

        {/* OR SIGN IN WITH Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--card-border)]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-semibold">
            <span className="bg-[var(--card-bg)] px-3 text-[var(--text-muted)]">
              Or Sign In With
            </span>
          </div>
        </div>

        {/* GitHub & Passkey buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGitHubClick}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[var(--btn-secondary-bg)] hover:bg-[var(--btn-secondary-hover)] border border-[var(--btn-secondary-border)] text-xs font-semibold text-[var(--btn-secondary-text)] transition-all active:scale-[0.99]"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </button>

          <button
            type="button"
            onClick={handlePasskeyClick}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[var(--btn-secondary-bg)] hover:bg-[var(--btn-secondary-hover)] border border-[var(--btn-secondary-border)] text-xs font-semibold text-[var(--btn-secondary-text)] transition-all active:scale-[0.99]"
          >
            <UserCheck className="w-4 h-4 text-[var(--text-accent)]" />
            <span>Passkey</span>
          </button>
        </div>

        {/* Demo Credentials Quick-Trigger */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-accent)] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--text-accent)]" />
            <span>Quick fill demo credentials</span>
          </button>
        </div>
      </form>

      {/* Forgot PIN Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-2xl text-left space-y-4">
            <h3 className="text-base font-bold text-[var(--text-primary)]">Reset Master PIN</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Enter your email address and we'll dispatch an instant reset link.
            </p>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <FormInput
                label="Email Address"
                id="forgotEmail"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="elena.rostova@noted.app"
                required
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Send Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
