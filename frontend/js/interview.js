requireRole("HR");

const prefilledApplicationId = new URLSearchParams(window.location.search).get("applicationId");
if (prefilledApplicationId) {
    document.getElementById("applicationId").value = prefilledApplicationId;
}

document.getElementById("interviewForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const applicationId = document.getElementById("applicationId").value.trim();
    const interviewerEmail = document.getElementById("interviewerEmail").value.trim().toLowerCase();
    const interviewDateTime = document.getElementById("interviewDateTime").value;
    const notes = document.getElementById("notes").value.trim();

    if (!applicationId || !interviewerEmail || !interviewDateTime || !notes) {
        showToast("All fields are required.", true);
        return;
    }
    if (!isValidEmail(interviewerEmail)) {
        showToast("Enter a valid interviewer email.", true);
        return;
    }

    try {
        await apiRequest("/interviews", {
            method: "POST",
            body: JSON.stringify({
                applicationId: Number(applicationId),
                interviewerEmail,
                interviewerName: interviewerEmail,
                interviewDateTime,
                notes
            })
        });
        showToast("Interview scheduled successfully.");
        if (prefilledApplicationId) {
            setTimeout(() => { window.location.href = "hr.html"; }, 1500);
        } else {
            document.getElementById("interviewForm").reset();
        }
    } catch (error) {
        showToast(error.message, true);
    }
});

async function fetchInterviews() {
    const applicationId = document.getElementById("searchApplicationId").value.trim();
    if (!applicationId) {
        showToast("Enter application ID.", true);
        return;
    }
    try {
        const interviews = await apiRequest(`/interviews/${applicationId}`);
        const list = document.getElementById("interviewList");
        list.innerHTML = "";
        if (!interviews.length) {
            list.innerHTML = "<li>No interviews found.</li>";
            return;
        }
        interviews.forEach((interview) => {
            const item = document.createElement("li");
            item.textContent = `Schedule: ${interview.interviewDateTime} | Interviewer: ${interview.interviewerEmail} | Notes: ${interview.notes}`;
            list.appendChild(item);
        });
    } catch (error) {
        showToast(error.message, true);
    }
}

document.getElementById("fetchInterviewsBtn").addEventListener("click", fetchInterviews);
