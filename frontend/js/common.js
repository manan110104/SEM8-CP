const API_BASE = (() => {
    const configured = window.API_CONFIG?.baseUrl?.trim();
    if (configured && !configured.includes("your-backend-name")) {
        return configured.replace(/\/$/, "");
    }
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        return "http://localhost:8080/api";
    }
    return (configured || "https://your-backend-name.onrender.com/api").replace(/\/$/, "");
})();

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function ensureLoadingOverlay() {
    if (document.getElementById("loadingOverlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "loadingOverlay";
    overlay.className = "loading-overlay";
    overlay.innerHTML = '<div class="spinner"></div><p>Loading...</p>';
    document.body.appendChild(overlay);
}

function showLoading() {
    ensureLoadingOverlay();
    document.getElementById("loadingOverlay").classList.add("active");
}

function hideLoading() {
    document.getElementById("loadingOverlay")?.classList.remove("active");
}

function showToast(message, isError = false) {
    let toast = document.getElementById("appToast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "appToast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = isError ? "toast toast-error show" : "toast show";
    setTimeout(() => toast.classList.remove("show"), 3500);
}

async function apiRequest(path, options = {}) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}${path}`, {
            headers: { "Content-Type": "application/json" },
            ...options
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : null;

        if (!response.ok) {
            const errorMessage = data?.error || data?.message || "API request failed";
            throw new Error(errorMessage);
        }
        return data;
    } catch (error) {
        throw new Error(error.message || "Network error. Check backend URL in js/config.js");
    } finally {
        hideLoading();
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
