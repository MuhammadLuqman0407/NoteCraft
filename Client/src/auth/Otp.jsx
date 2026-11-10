import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyEmail, getPendingEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fromState = location.state?.email;
        const fromSession = getPendingEmail();
        setEmail(fromState || fromSession || '');
    }, [location.state, getPendingEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const data = await verifyEmail({ email, otp });
            setSuccess(data.message || 'Email verified successfully!');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Verify your email"
            subtitle="Enter the OTP sent to your email address"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <Alert type="error" message={error} />
                <Alert type="success" message={success} />

                <FormInput
                    label="Email"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                />

                <FormInput
                    label="OTP Code"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    required
                    maxLength={6}
                    autoComplete="one-time-code"
                />

                <Button type="submit" disabled={loading || otp.length < 4}>
                    {loading ? 'Verifying...' : 'Verify Email'}
                </Button>

                <p className="text-center text-sm text-[var(--text-muted)]">
                    Already verified?{' '}
                    <Link to="/login" className="auth-link font-medium">
                        Sign in
                    </Link>
                </p>

                <p className="text-center text-sm text-[var(--text-muted)]">
                    Need a new account?{' '}
                    <Link to="/register" className="auth-link font-medium">
                        Register
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
