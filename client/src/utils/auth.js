// Small helpers around the JWT stored in localStorage.

export function getToken() {
    return localStorage.getItem('token');
}

export function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
}

// Decode the JWT payload (base64url) and check the exp claim client-side.
// This is a UX check only; the server still verifies the signature.
export function isTokenValid() {
    const token = getToken();
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}
