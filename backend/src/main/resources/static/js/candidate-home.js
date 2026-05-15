const urlParams = new URLSearchParams(window.location.search);
const sessionUser = getSession();
const emailFromUrl = urlParams.get("email");
const candidateUser = sessionUser && sessionUser.role === "CANDIDATE" ? sessionUser : null;
const candidateEmail = candidateUser?.email || emailFromUrl || "";
const candidateName = candidateUser?.name || "Candidate";

document.getElementById("candidateWelcome").textContent = `Welcome, ${candidateName}`;
document.getElementById("candidateMessage").textContent = "You will receive updates here when HR shortlists/rejects or schedules interviews.";
document.getElementById("candidateName").value = candidateName;
document.getElementById("email").value = candidateEmail;
if (!candidateEmail) {
    document.getElementById("candidateMessage").textContent = "Dashboard opened without login. Add ?email=yourmail@example.com in URL to load messages, or login as candidate.";
}

document.getElementById("applicationForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const candidateName = document.getElementById("candidateName").value.trim();
    const email = document.getElementById("email").value.trim();
    const skills = document.getElementById("skills").value.trim();
    const experience = document.getElementById("experience").value.trim();

    try {
        await apiRequest("/apply", {
            method: "POST",
            body: JSON.stringify({ candidateName, email, skills, experience })
        });
        alert("Application submitted successfully.");
        document.getElementById("skills").value = "";
        document.getElementById("experience").value = "";
        loadCandidateHome();
    } catch (error) {
        alert(error.message);
    }
});

async function loadCandidateHome() {
    if (!candidateEmail) return;
    try {
        const data = await apiRequest(`/candidate/home?email=${encodeURIComponent(candidateEmail)}`);
        const updates = document.getElementById("candidateUpdates");
        const notifications = document.getElementById("candidateNotifications");
        updates.innerHTML = "";
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

        if (!data.applications || data.applications.length === 0) {
            updates.innerHTML = `<p>${data.message}</p>`;
            return;
        }

        data.applications.forEach((app) => {
            const card = document.createElement("div");
            card.className = "update-card";
            card.innerHTML = `
                <h3>Application #${app.id}</h3>
                <p><strong>Status:</strong> ${app.status}</p>
                <p><strong>Skills:</strong> ${app.skills}</p>
                <p><strong>Experience:</strong> ${app.experience}</p>
                <p>${buildStatusMessage(app.status)}</p>
            `;
            updates.appendChild(card);
            loadInterviewByApplication(app.id, card);
        });
    } catch (error) {
        alert(error.message);
    }
}

function buildStatusMessage(status) {
    if (status === "Shortlisted") return "HR has shortlisted your profile.";
    if (status === "Rejected") return "HR has rejected your profile.";
    if (status === "Interview Scheduled") return "Interview is scheduled. Details are shown below.";
    return "Application submitted and under review.";
}

async function loadInterviewByApplication(applicationId, card) {
    try {
        const interviews = await apiRequest(`/interviews/${applicationId}`);
        if (!interviews.length) return;
        const latest = interviews[interviews.length - 1];
        const details = document.createElement("p");
        details.innerHTML = `<strong>Interview:</strong> ${latest.interviewDateTime} | Interviewer: ${latest.interviewerName} (${latest.interviewerEmail}) | Notes: ${latest.notes}`;
        card.appendChild(details);
    } catch (_error) {
        // Skip interview details if not available.
    }
}

loadCandidateHome();
