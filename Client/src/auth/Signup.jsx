import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            const data = await register({ username, email, password });
            setSuccess(data.message || 'Registration successful! Check your email for OTP.');
            setTimeout(() => {
                navigate('/verify-otp', { state: { email } });
            }, 1500);
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create account"
            subtitle="Register and verify your email with OTP"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <Alert type="error" message={error} />
                <Alert type="success" message={success} />

                <FormInput
                    label="Username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                    required
                    autoComplete="username"
                />

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
                    placeholder="At least 6 characters"
                    required
                    autoComplete="new-password"
                />

                <FormInput
                    label="Confirm Password"
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    autoComplete="new-password"
                />

                <Button type="submit" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                </Button>

                <p className="text-center text-sm text-[var(--text-muted)]">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link font-medium">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
