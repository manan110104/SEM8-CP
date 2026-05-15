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
    const interviewerName = interviewerEmail;

    if (!applicationId || !interviewerEmail || !interviewDateTime || !notes) {
        alert("All fields are required.");
        return;
    }

    try {
        await apiRequest("/interviews", {
            method: "POST",
            body: JSON.stringify({ applicationId: Number(applicationId), interviewerName, interviewerEmail, interviewDateTime, notes })
        });
        alert("Interview scheduled successfully.");
        document.getElementById("interviewForm").reset();
    } catch (error) {
        alert(error.message);
    }
});

async function fetchInterviews() {
    const applicationId = document.getElementById("searchApplicationId").value.trim();
    if (!applicationId) {
        alert("Enter application id to view interviews.");
        return;
    }

    try {
        const interviews = await apiRequest(`/interviews/${applicationId}`);
        const list = document.getElementById("interviewList");
        list.innerHTML = "";

        if (interviews.length === 0) {
            list.innerHTML = "<li>No interviews found.</li>";
            return;
        }

        interviews.forEach((interview) => {
            const item = document.createElement("li");
            item.textContent = `Schedule: ${interview.interviewDateTime}, Interviewer Email: ${interview.interviewerEmail}, Notes: ${interview.notes}`;
            list.appendChild(item);
        });
    } catch (error) {
        alert(error.message);
    }
}

document.getElementById("fetchInterviewsBtn").addEventListener("click", fetchInterviews);
