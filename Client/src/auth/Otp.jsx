import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, RefreshCw, Edit2, Sparkles, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendOtp, getPendingEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editedEmail, setEditedEmail] = useState('');

  // 6 separate digits for OTP
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // 60-second timer countdown
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const fromState = location.state?.email;
    const fromSession = getPendingEmail();
    const resolvedEmail = fromState || fromSession || 'elena.rostova@noted.app';
    setEmail(resolvedEmail);
    setEditedEmail(resolvedEmail);
  }, [location.state, getPendingEmail]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const otpValue = otpDigits.join('');

  const handleDigitChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, '');

    if (!cleanValue) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    const digit = cleanValue.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setError('');

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setOtpDigits(newDigits);
    setError('');

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleFillDemoCode = () => {
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    setError('');
    toast.success('Loaded demo OTP code: 123456');
    inputRefs.current[5]?.focus();
  };

  const handleResendOtp = async () => {
    if (!canResend || resending) return;
    setResending(true);
    setError('');

    try {
      await resendOtp(email);
      setTimer(60);
      setCanResend(false);
      toast.success('Fresh security PIN dispatched to your email.');
    } catch (err) {
      toast.error(err.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  const handleSaveEmailEdit = (e) => {
    e.preventDefault();
    if (!editedEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setEmail(editedEmail.trim().toLowerCase());
    setIsEditingEmail(false);
    toast.success(`Updated destination to ${editedEmail.trim().toLowerCase()}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits of your security PIN.');
      return;
    }

    setLoading(true);

    try {
      const data = await verifyEmail({ email, otp: otpValue });
      toast.success(data.message || 'Verification successful! Unlocking workspace...');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Invalid or expired security PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      activeTab="otp"
      badge="TWO-FACTOR AUTHENTICATION"
      title="Verify security PIN"
      subtitle="Enter the 6-digit one-time code sent to your registered inbox."
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-left">
        <Alert type="error" message={error} onClose={() => setError('')} />

        {/* Email Destination row */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[var(--text-secondary)]">Destination Email</span>
            {!isEditingEmail && (
              <button
                type="button"
                onClick={() => setIsEditingEmail(true)}
                className="text-[var(--text-accent)] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" /> Change
              </button>
            )}
          </div>

          {isEditingEmail ? (
            <div className="flex items-center gap-2 animate-fade-in">
              <input
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                className="flex-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-border-focus)]"
                placeholder="new@noted.app"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveEmailEdit}
                className="px-3 py-2 rounded-xl bg-[var(--btn-primary-bg)] text-white text-xs font-semibold"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditedEmail(email);
                  setIsEditingEmail(false);
                }}
                className="px-2.5 py-2 rounded-xl bg-[var(--btn-secondary-bg)] border border-[var(--btn-secondary-border)] text-[var(--btn-secondary-text)] text-xs"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-xs font-medium text-[var(--text-primary)]">
              <Mail className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
              <span className="truncate">{email}</span>
            </div>
          )}
        </div>

        {/* 6-Digit Segmented Code */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <label className="font-medium text-[var(--text-secondary)]">
              Security PIN
            </label>

            {/* Countdown / Resend Action */}
            <div>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-[var(--text-accent)] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                  <span>Resend code</span>
                </button>
              ) : (
                <span className="text-[var(--text-muted)] text-[11px]">
                  Resend in 0:{(timer % 60).toString().padStart(2, '0')}
                </span>
              )}
            </div>
          </div>

          {/* Digits Boxes */}
          <div
            className="flex items-center justify-between gap-1.5 sm:gap-2 pt-1"
            onPaste={handlePaste}
          >
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border transition-all duration-150 outline-none ${
                  digit
                    ? 'border-[var(--input-border-focus)] bg-[var(--input-bg-focus)] text-[var(--input-text)] shadow-sm'
                    : 'border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] focus:border-[var(--input-border-focus)] focus:bg-[var(--input-bg-focus)]'
                }`}
                aria-label={`Digit ${index + 1} of PIN`}
              />
            ))}
          </div>

          <p className="text-[11px] text-[var(--text-muted)] text-center pt-1">
            Tip: Paste 6-digit code or use Auto-Fill below
          </p>
        </div>

        {/* Primary Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading || otpValue.length < 6}
            loading={loading}
            icon={<ArrowRight className="w-4 h-4 ml-1" />}
          >
            {loading ? 'Verifying PIN...' : 'Unlock Notes'}
          </Button>
        </div>

        {/* Quick Demo Code helper */}
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={handleFillDemoCode}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-accent)] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--text-accent)]" />
            <span>Auto fill demo PIN (123456)</span>
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
