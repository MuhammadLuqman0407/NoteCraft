import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login, setPendingEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err) {
            if (err.message === 'Email not verified') {
                setPendingEmail(email);
                navigate('/verify-otp', { state: { email } });
                return;
            }
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to continue to your account"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <Alert type="error" message={error} />

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
                    label="Password"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                />

                <Button type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <p className="text-center text-sm text-[var(--text-muted)]">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="auth-link font-medium">
                        Register
                    </Link>
                </p>

                <p className="text-center text-sm text-[var(--text-muted)]">
                    Need to verify email?{' '}
                    <Link to="/verify-otp" className="auth-link font-medium">
                        Enter OTP
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
