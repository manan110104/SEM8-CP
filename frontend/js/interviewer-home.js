const sessionUser = getSession();
const interviewerUser = sessionUser && sessionUser.role === "INTERVIEWER" ? sessionUser : null;

if (!interviewerUser) {
    window.location.href = "login.html";
} else {
    document.getElementById("interviewerWelcome").textContent = `Welcome, ${interviewerUser.name}`;
}

async function loadInterviewerHome() {
    if (!interviewerUser) return;
    try {
        const data = await apiRequest(`/interviews/home?email=${encodeURIComponent(interviewerUser.email)}`);
        document.getElementById("interviewerMessage").textContent = data.message;
        const notifications = document.getElementById("interviewerNotifications");
        const target = document.getElementById("interviewerInterviews");
        notifications.innerHTML = "";
        target.innerHTML = "";

        if (data.notifications?.length) {
            data.notifications.forEach((text) => {
                const li = document.createElement("li");
                li.textContent = text;
                notifications.appendChild(li);
            });
        } else {
            notifications.innerHTML = "<li>No new messages yet.</li>";
        }

        if (!data.interviews?.length) {
            target.innerHTML = '<p class="empty-state">No interviews assigned yet.</p>';
            return;
        }

        data.interviews.forEach((item) => {
            const card = document.createElement("div");
            card.className = "update-card";
            card.innerHTML = `<h3>Application #${item.applicationId}</h3><p><strong>Schedule:</strong> ${item.interviewDateTime}</p><p><strong>Notes:</strong> ${item.notes}</p>`;
            target.appendChild(card);
        });
    } catch (error) {
        showToast(error.message, true);
    }
}

loadInterviewerHome();
