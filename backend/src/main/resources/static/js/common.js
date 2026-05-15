const API_BASE = "http://localhost:8080/api";

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function apiRequest(path, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${path}`, {
            headers: { "Content-Type": "application/json" },
            ...options
        });

        let data = null;
        const text = await response.text();
        data = text ? JSON.parse(text) : null;

        if (!response.ok) {
            const errorMessage = data?.error || data?.message || "API request failed";
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        throw new Error(error.message || "Network error. Please check backend server.");
    }
}

function saveSession(user) {
    localStorage.setItem("recruitment_user", JSON.stringify(user));
}

function getSession() {
    const raw = localStorage.getItem("recruitment_user");
    return raw ? JSON.parse(raw) : null;
}

function clearSession() {
    localStorage.removeItem("recruitment_user");
}

function requireRole(role) {
    const user = getSession();
    if (!user || user.role !== role) {
        window.location.href = "login.html";
        return null;
    }
    return user;
}

function logout() {
    clearSession();
    window.location.href = "login.html";
}
