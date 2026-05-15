document.getElementById("applicationForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const candidateName = document.getElementById("candidateName").value.trim();
    const email = document.getElementById("email").value.trim();
    const skills = document.getElementById("skills").value.trim();
    const experience = document.getElementById("experience").value.trim();

    if (!candidateName || !email || !skills || !experience) {
        alert("Please fill all fields.");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Please enter a valid email.");
        return;
    }

    try {
        await apiRequest("/apply", {
            method: "POST",
            body: JSON.stringify({ candidateName, email, skills, experience })
        });
        alert("Application submitted successfully.");
        document.getElementById("applicationForm").reset();
    } catch (error) {
        alert(error.message);
    }
});
