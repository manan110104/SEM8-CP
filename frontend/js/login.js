const roleParam = new URLSearchParams(window.location.search).get("role");
if (roleParam) {
    document.getElementById("role").value = roleParam.toUpperCase();
}

document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!email || !password || !role) {
        showToast("All fields are required.", true);
        return;
    }
    if (!isValidEmail(email)) {
        showToast("Enter a valid email address.", true);
        return;
    }

    try {
        const result = await apiRequest("/login", {
            method: "POST",
            body: JSON.stringify({ email, password, role })
        });
        saveSession(result.user);
        showToast(result.message);
        setTimeout(() => {
            if (role === "HR") window.location.replace("hr.html");
            else if (role === "CANDIDATE") window.location.replace("candidate-home.html");
            else window.location.replace("interviewer-home.html");
        }, 800);
    } catch (error) {
        showToast(error.message, true);
    }
});
