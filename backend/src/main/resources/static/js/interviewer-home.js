const urlParams = new URLSearchParams(window.location.search);
const sessionUser = getSession();
const emailFromUrl = urlParams.get("email");
const interviewerUser = sessionUser && sessionUser.role === "INTERVIEWER" ? sessionUser : null;
const interviewerEmail = interviewerUser?.email || emailFromUrl || "";
const interviewerName = interviewerUser?.name || "Interviewer";
document.getElementById("interviewerWelcome").textContent = `Welcome, ${interviewerName}`;
if (!interviewerEmail) {
    document.getElementById("interviewerMessage").textContent = "Dashboard opened without login. Add ?email=yourmail@example.com in URL to load messages, or login as interviewer.";
}

async function loadInterviewerHome() {
    if (!interviewerEmail) return;
    try {
        const data = await apiRequest(`/interviews/home?email=${encodeURIComponent(interviewerEmail)}`);
        document.getElementById("interviewerMessage").textContent = data.message;
        const target = document.getElementById("interviewerInterviews");
        const notifications = document.getElementById("interviewerNotifications");
        target.innerHTML = "";
        notifications.innerHTML = "";

        if (data.notifications && data.notifications.length) {
            data.notifications.forEach((text) => {
                const li = document.createElement("li");
                li.textContent = text;
                notifications.appendChild(li);
            });
        } else {
            notifications.innerHTML = "<li>No new messages yet.</li>";
        }

        if (!data.interviews || data.interviews.length === 0) {
            target.innerHTML = "<p>No interviews assigned yet.</p>";
            return;
        }

        data.interviews.forEach((item) => {
            const card = document.createElement("div");
            card.className = "update-card";
            card.innerHTML = `
                <h3>Application #${item.applicationId}</h3>
                <p><strong>Schedule:</strong> ${item.interviewDateTime}</p>
                <p><strong>Candidate update:</strong> Interview Scheduled</p>
                <p><strong>Notes:</strong> ${item.notes}</p>
            `;
            target.appendChild(card);
        });
    } catch (error) {
        alert(error.message);
    }
}

loadInterviewerHome();
