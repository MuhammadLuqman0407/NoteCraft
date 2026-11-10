const API_BASE = '/api/auth';

async function request(url, options = {}) {
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
