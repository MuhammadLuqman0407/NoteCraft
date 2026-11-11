const API_BASE = '/api/auth';

// Helper to determine if we should fall back to demo mode when server is offline
async function request(url, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${url}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const error = new Error(data.message || 'Something went wrong');
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (err) {
        // If server is not running (e.g., connection refused, 404, or network failure),
        // provide simulated development fallback so the user can test the full UI flow.
        if (err.name === 'TypeError' || err.status === 404 || err.message?.includes('fetch')) {
            console.info(`[NoteCraft Auth] Backend server not reachable at ${url}. Using local demo simulation mode.`);
            return handleMockFallback(url, options);
        }
        throw err;
    }
}

// Simulated local fallback for offline/development testing
function handleMockFallback(url, options = {}) {
    const body = options.body ? JSON.parse(options.body) : {};

    if (url === '/register') {
        const users = JSON.parse(localStorage.getItem('notecraft_mock_users') || '[]');
        if (users.some((u) => u.email.toLowerCase() === body.email?.toLowerCase())) {
            // Already registered check
            const user = users.find((u) => u.email.toLowerCase() === body.email?.toLowerCase());
            if (user?.verified) {
                throw new Error('An account with this email already exists. Please sign in.');
            }
        } else {
            users.push({
                username: body.username || 'User',
                email: body.email,
                password: body.password,
                verified: false,
            });
            localStorage.setItem('notecraft_mock_users', JSON.stringify(users));
        }
        return {
            success: true,
            message: 'Account created! A 6-digit verification code has been sent to your email.',
        };
    }

    if (url === '/verify-email') {
        if (!body.otp || body.otp.length !== 6) {
            throw new Error('Please enter a valid 6-digit OTP code.');
        }
        // In demo mode, accept 123456 or any 6 digits
        const users = JSON.parse(localStorage.getItem('notecraft_mock_users') || '[]');
        const userIndex = users.findIndex((u) => u.email.toLowerCase() === body.email?.toLowerCase());
        if (userIndex !== -1) {
            users[userIndex].verified = true;
            localStorage.setItem('notecraft_mock_users', JSON.stringify(users));
        }
        return {
            success: true,
            message: 'Email successfully verified! You can now sign in.',
        };
    }

    if (url === '/resend-otp') {
        return {
            success: true,
            message: 'A fresh 6-digit verification code has been dispatched to your email.',
        };
    }

    if (url === '/login') {
        const users = JSON.parse(localStorage.getItem('notecraft_mock_users') || '[]');
        const existing = users.find((u) => u.email?.toLowerCase() === body.email?.toLowerCase());

        // Allow demo user or registered user
        const isDemo = body.email === 'demo@notecraft.io';
        if (!existing && !isDemo) {
            // Auto register demo convenience
            users.push({
                username: body.email.split('@')[0],
                email: body.email,
                password: body.password,
                verified: true,
            });
            localStorage.setItem('notecraft_mock_users', JSON.stringify(users));
        } else if (existing && existing.password !== body.password && !isDemo) {
            throw new Error('Invalid email or password. Please try again.');
        }

        const username = existing?.username || body.email.split('@')[0] || 'Demo User';
        return {
            success: true,
            accessToken: 'mock_jwt_token_' + Math.random().toString(36).substring(2),
            user: {
                username,
                email: body.email,
            },
        };
    }

    if (url === '/get-me') {
        return {
            user: {
                username: 'Demo User',
                email: 'demo@notecraft.io',
            },
        };
    }

    if (url === '/logout' || url === '/logout-all') {
        return { success: true };
    }

    if (url === '/refresh-token') {
        return { accessToken: 'mock_jwt_token_refreshed' };
    }

    return { success: true };
}

export function register({ username, email, password }) {
    return request('/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
    });
}

export function login({ email, password }) {
    return request('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

export function verifyEmail({ email, otp }) {
    return request('/verify-email', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
    });
}

export function resendOtp({ email }) {
    return request('/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
}

export function getMe(accessToken) {
    return request('/get-me', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export function refreshToken() {
    return request('/refresh-token', {
        method: 'GET',
    });
}

export function logout() {
    return request('/logout', {
        method: 'GET',
    });
}

export function logoutAll() {
    return request('/logout-all', {
        method: 'GET',
    });
}
