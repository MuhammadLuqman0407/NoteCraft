import { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, KeyRound, Eye, EyeOff, ArrowRight, UserCheck, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const termsId = useId();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password requirements calculation
  const hasMinLength = password.length >= 8;
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const strengthScore = [hasMinLength, hasUpperLower, hasNumber].filter(Boolean).length;
  const strengthText = strengthScore === 3 ? 'Strong' : strengthScore === 2 ? 'Fair' : 'Min 8 chars';

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please provide a full name or username.');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!hasMinLength) {
      setError('Passphrase must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passphrases do not match. Please verify both fields.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service to continue.');
      return;
    }

    setLoading(true);

    try {
      const data = await register({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      toast.success(data.message || 'Account initialized! Enter OTP to confirm.');
      navigate('/verify-otp', { state: { email: email.trim().toLowerCase() } });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubClick = () => {
    toast('GitHub registration placeholder.', { icon: '🐙' });
  };

  const handlePasskeyClick = () => {
    toast('Passkey setup available after account verification.', { icon: '👤' });
  };

  return (
    <AuthLayout
      activeTab="signup"
      badge="NEW WORKSPACE"
      title="Create account"
      subtitle="Begin capturing your serene knowledge base and offline notes."
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <Alert type="error" message={error} onClose={() => setError('')} />

        {/* Username / Name */}
        <FormInput
          label="Full Name or Handle"
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Elena Rostova"
          required
          autoComplete="name"
          hint="Visible in workspace"
          icon={<User className="w-4 h-4" />}
        />

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

        {/* Passphrase */}
        <FormInput
          label="Passphrase / Master PIN"
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          required
          autoComplete="new-password"
          hint={password.length > 0 ? strengthText : 'Min 8 chars'}
          icon={<KeyRound className="w-4 h-4" />}
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

        {/* Confirm Passphrase */}
        <FormInput
          label="Confirm Passphrase"
          id="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat your passphrase"
          required
          autoComplete="new-password"
          icon={<KeyRound className="w-4 h-4" />}
          rightAction={
            passwordsMatch ? (
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Match
              </span>
            ) : passwordsMismatch ? (
              <span className="text-red-500 text-xs font-semibold flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> No match
              </span>
            ) : null
          }
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded"
              aria-label={showConfirmPassword ? 'Hide passphrase' : 'Show passphrase'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        {/* Checkbox Terms row */}
        <div className="flex items-center justify-between text-xs pt-1 select-none">
          <label htmlFor={termsId} className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              id={termsId}
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--input-border)] bg-[var(--input-bg)] accent-[var(--color-primary)] cursor-pointer"
            />
            <span className="text-[var(--text-secondary)] font-medium">
              Accept Terms of Service & Privacy
            </span>
          </label>

          {/* Required pill */}
          <span className="px-2 py-0.5 rounded-md bg-[var(--pill-bg)] text-[var(--pill-text)] text-[11px] font-semibold tracking-wide">
            Required
          </span>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading || (confirmPassword.length > 0 && password !== confirmPassword)}
            loading={loading}
            icon={<ArrowRight className="w-4 h-4 ml-1" />}
          >
            {loading ? 'Setting up workspace...' : 'Create Workspace'}
          </Button>
        </div>

        {/* OR SIGN UP WITH Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--card-border)]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-semibold">
            <span className="bg-[var(--card-bg)] px-3 text-[var(--text-muted)]">
              Or Sign Up With
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
      </form>
    </AuthLayout>
  );
}
