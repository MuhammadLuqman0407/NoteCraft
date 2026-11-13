import { useState, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, KeyRound, Eye, EyeOff, ArrowRight, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;
  if (score <= 1) return { score, label: 'Too weak', color: 'text-red-500' };
  if (score === 2) return { score, label: 'Weak', color: 'text-orange-500' };
  if (score === 3) return { score, label: 'Fair', color: 'text-yellow-500' };
  if (score === 4) return { score, label: 'Good', color: 'text-blue-500' };
  return { score, label: 'Strong', color: 'text-emerald-500' };
}

export default function Register() {
  const navigate = useNavigate();
  const { register, setPendingEmail } = useAuth();
  const termsId = useId();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);
  const strengthText = password
    ? `Strength: ${strength.label}`
    : 'Min 8 characters';
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const name = username.trim();
    if (!name || name.length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service to continue.');
      return;
    }

    setLoading(true);
    try {
      await register({ username: name, email: email.trim().toLowerCase(), password });
      setPendingEmail(email.trim().toLowerCase());
      toast.success('Account created! Check your email for the verification code.');
      navigate('/verify-otp');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      mode="signup"
      badge="NOTECRAFT"
      title="Create your account"
      subtitle="Join NoteCraft and start organizing your thoughts."
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <Alert type="error" message={error} onClose={() => setError('')} />

        {/* Full Name */}
        <FormInput
          label="Full Name"
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your full name"
          required
          autoComplete="name"
          hint="At least 2 characters"
          icon={<User className="w-4 h-4" />}
        />

        {/* Email Address */}
        <FormInput
          label="Email Address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          autoComplete="email"
          hint="We'll send a verification code here"
          icon={<Mail className="w-4 h-4" />}
        />

        {/* Password */}
        <FormInput
          label="Password"
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a strong password"
          required
          autoComplete="new-password"
          hint={
            password ? (
              <span className={strength.color}>{strengthText}</span>
            ) : (
              strengthText
            )
          }
          icon={<KeyRound className="w-4 h-4" />}
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

        {/* Confirm Password */}
        <FormInput
          label="Confirm Password"
          id="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
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
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded cursor-pointer"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        {/* Terms Checkbox */}
        <div className="pt-1 select-none">
          <label htmlFor={termsId} className="flex items-start gap-2.5 cursor-pointer text-xs">
            <input
              type="checkbox"
              id={termsId}
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-[var(--input-border)] bg-[var(--input-bg)] accent-[var(--color-primary)] cursor-pointer shrink-0"
            />
            <span className="text-[var(--text-secondary)] leading-relaxed font-normal">
              I agree to the{' '}
              <span className="text-[var(--color-primary)] font-medium underline">Terms of Service</span>
              {' '}and{' '}
              <span className="text-[var(--color-primary)] font-medium underline">Privacy Policy</span>
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading || passwordsMismatch}
            loading={loading}
            icon={<ArrowRight className="w-4 h-4 ml-1" />}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </div>

        {/* Link to Sign In */}
        <p className="text-center text-xs text-[var(--text-muted)] pt-1 select-none">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[var(--color-primary)] hover:underline font-semibold ml-1"
          >
            Sign in →
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
