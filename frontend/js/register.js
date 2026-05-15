const registerRoleParam = new URLSearchParams(window.location.search).get("role");
if (registerRoleParam && (registerRoleParam === "CANDIDATE" || registerRoleParam === "INTERVIEWER")) {
    document.getElementById("role").value = registerRoleParam;
}

document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!name || !email || !password || !role) {
        showToast("All fields are required.", true);
        return;
    }
    if (!isValidEmail(email)) {
        showToast("Enter a valid email.", true);
        return;
    }

    try {
        const result = await apiRequest("/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password, role })
        });
        showToast(result.message);
        setTimeout(() => {
            window.location.href = `login.html?role=${encodeURIComponent(role)}`;
        }, 1200);
    } catch (error) {
        showToast(error.message, true);
    }
});
