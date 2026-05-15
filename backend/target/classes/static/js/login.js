const roleParam = new URLSearchParams(window.location.search).get("role");
if (roleParam) {
    const roleSelect = document.getElementById("role");
    roleSelect.value = roleParam.toUpperCase();
}

document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!email || !password || !role) {
        alert("All fields are required.");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Enter a valid email address.");
        return;
    }

    try {
        const result = await apiRequest("/login", {
            method: "POST",
            body: JSON.stringify({ email, password, role })
        });

        saveSession(result.user);
        alert(result.message);
        if (role === "HR") {
            window.location.replace("/hr.html");
            return;
        }
        if (role === "CANDIDATE") {
            window.location.replace("/candidate-home.html");
            return;
        }
        window.location.replace("/interviewer-home.html");
    } catch (error) {
        alert(error.message);
    }
});
