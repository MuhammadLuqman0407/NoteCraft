import { useState, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Eye, EyeOff, ArrowRight } from 'lucide-react';
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

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim().toLowerCase(), password });
      toast.success('Welcome back to NoteCraft!');
      navigate('/dashboard');
    } catch (err) {
      if (err.message === 'Email not verified') {
        setPendingEmail(email.trim().toLowerCase());
        toast('Please verify your email with the OTP sent to your inbox.', { icon: '🛡️' });
        navigate('/verify-otp', { state: { email: email.trim().toLowerCase() } });
        return;
      }
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error('Please enter your email address.');
      return;
    }
    toast.success(`Password reset OTP sent to ${forgotEmail}`);
    setShowForgotModal(false);
  };

  return (
    <AuthLayout
      mode="signin"
      badge="NOTECRAFT"
      title="Sign in to NoteCraft"
      subtitle="Access your notes, tasks, and workspace."
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <Alert type="error" message={error} onClose={() => setError('')} />

        {/* Email */}
        <FormInput
          label="Email Address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          autoComplete="email"
          hint="Your registered email"
          icon={<Mail className="w-4 h-4" />}
        />

        {/* Password */}
        <FormInput
          label="Password"
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
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
              className="text-[var(--color-primary)] hover:underline text-xs font-semibold cursor-pointer"
            >
              Forgot?
            </button>
          }
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        {/* Remember device */}
        <div className="flex items-center justify-between text-xs pt-1 select-none">
          <label htmlFor={rememberId} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id={rememberId}
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--input-border)] bg-[var(--input-bg)] accent-[var(--color-primary)] cursor-pointer"
            />
            <span className="text-[var(--text-secondary)] font-medium">Keep me signed in</span>
          </label>
          <span className="px-2 py-0.5 rounded-md bg-[var(--pill-bg)] text-[var(--pill-text)] text-[11px] font-semibold tracking-wide">
            30 Days
          </span>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            icon={<ArrowRight className="w-4 h-4 ml-1" />}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>

        {/* Footer links */}
        <div className="pt-2 border-t border-[var(--card-border)]/70 space-y-2 text-center text-xs text-[var(--text-muted)] select-none">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--color-primary)] hover:underline font-semibold ml-1">
              Create an account →
            </Link>
          </p>
          <p>
            Need to verify your email?{' '}
            <Link
              to="/verify-otp"
              className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:underline font-medium ml-1"
            >
              Enter OTP code
            </Link>
          </p>
        </div>
      </form>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-2xl text-left space-y-4">
            <h3 className="text-base font-bold text-[var(--text-primary)]">Reset Password</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Enter your email and we'll send an OTP code to reset your password.
            </p>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <FormInput
                label="Email Address"
                id="forgotEmail"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Enter your email address"
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
                  Send Code
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
