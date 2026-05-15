const sessionUser = getSession();
const candidateUser = sessionUser && sessionUser.role === "CANDIDATE" ? sessionUser : null;
const candidateEmail = candidateUser?.email || "";
const candidateName = candidateUser?.name || "Candidate";

if (!candidateUser) {
    window.location.href = "login.html";
} else {
    document.getElementById("candidateWelcome").textContent = `Welcome, ${candidateName}`;
    document.getElementById("candidateMessage").textContent = "Updates appear when HR shortlists, rejects, or schedules interviews.";
    document.getElementById("candidateName").value = candidateName;
    document.getElementById("email").value = candidateEmail;
}

document.getElementById("applicationForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
        await apiRequest("/apply", {
            method: "POST",
            body: JSON.stringify({
                candidateName: document.getElementById("candidateName").value.trim(),
                email: document.getElementById("email").value.trim(),
                skills: document.getElementById("skills").value.trim(),
                experience: document.getElementById("experience").value.trim()
            })
        });
        showToast("Application submitted successfully.");
        document.getElementById("skills").value = "";
        document.getElementById("experience").value = "";
        loadCandidateHome();
    } catch (error) {
        showToast(error.message, true);
    }
});

async function loadCandidateHome() {
    if (!candidateEmail) return;
    try {
        const data = await apiRequest(`/candidate/home?email=${encodeURIComponent(candidateEmail)}`);
        const notifications = document.getElementById("candidateNotifications");
        const updates = document.getElementById("candidateUpdates");
        notifications.innerHTML = "";
        updates.innerHTML = "";

        if (data.notifications?.length) {
            data.notifications.forEach((text) => {
                const li = document.createElement("li");
                li.textContent = text;
                notifications.appendChild(li);
            });
        } else {
            notifications.innerHTML = "<li>No new messages yet.</li>";
        }

        if (!data.applications?.length) {
            updates.innerHTML = `<p class="empty-state">${data.message}</p>`;
            return;
        }

        for (const app of data.applications) {
            const card = document.createElement("div");
            card.className = "update-card";
            card.innerHTML = `<h3>Application #${app.id}</h3><p><strong>Status:</strong> ${app.status}</p><p><strong>Skills:</strong> ${app.skills}</p><p><strong>Experience:</strong> ${app.experience}</p>`;
            updates.appendChild(card);
            try {
                const interviews = await apiRequest(`/interviews/${app.id}`);
                if (interviews.length) {
                    const latest = interviews[interviews.length - 1];
                    const p = document.createElement("p");
                    p.innerHTML = `<strong>Interview:</strong> ${latest.interviewDateTime} | Interviewer: ${latest.interviewerEmail} | Notes: ${latest.notes}`;
                    card.appendChild(p);
                }
            } catch (_e) { /* optional */ }
        }
    } catch (error) {
        showToast(error.message, true);
    }
}

loadCandidateHome();
