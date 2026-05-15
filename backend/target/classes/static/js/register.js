const registerForm = document.getElementById("registerForm");
const registerRoleParam = new URLSearchParams(window.location.search).get("role");
if (registerRoleParam && (registerRoleParam === "CANDIDATE" || registerRoleParam === "INTERVIEWER")) {
    document.getElementById("role").value = registerRoleParam;
}

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!name || !email || !password || !role) {
        alert("All fields are required.");
        return;
    }
    if (!isValidEmail(email)) {
        alert("Enter a valid email.");
        return;
    }

    try {
        const result = await apiRequest("/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password, role })
        });
        alert(result.message);
        window.location.href = `login.html?role=${encodeURIComponent(role)}`;
    } catch (error) {
        alert(error.message);
    }
});
