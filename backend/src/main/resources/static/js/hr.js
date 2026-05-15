requireRole("HR");

function statusClass(status) {
    if (status === "Applied") return "status-applied";
    if (status === "Shortlisted") return "status-shortlisted";
    if (status === "Rejected") return "status-rejected";
    if (status === "Interview Scheduled") return "status-shortlisted";
    return "";
}

async function loadApplications() {
    const skill = document.getElementById("filterSkill").value.trim();
    const status = document.getElementById("filterStatus").value;

    let query = [];
    if (skill) query.push(`skill=${encodeURIComponent(skill)}`);
    if (status) query.push(`status=${encodeURIComponent(status)}`);
    const queryString = query.length ? `?${query.join("&")}` : "";

    try {
        const applications = await apiRequest(`/applications${queryString}`);
        const tableBody = document.getElementById("applicationsTableBody");
        tableBody.innerHTML = "";

        applications.forEach((app) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${app.id}</td>
                <td>${app.candidateName}</td>
                <td>${app.email}</td>
                <td>${app.skills}</td>
                <td>${app.experience}</td>
                <td class="${statusClass(app.status)}">${app.status}</td>
                <td>
                    <div class="row-actions">
                        <button onclick="updateStatus(${app.id}, 'Shortlisted')">Shortlist</button>
                        <button onclick="updateStatus(${app.id}, 'Rejected')">Reject</button>
                        <button onclick="scheduleInterview(${app.id})">Schedule Interview</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        alert(error.message);
    }
}

async function updateStatus(id, status) {
    try {
        await apiRequest(`/applications/${id}/status`, {
            method: "PUT",
            body: JSON.stringify({ status })
        });
        alert(`Status updated to ${status}`);
        loadApplications();
    } catch (error) {
        alert(error.message);
    }
}

async function scheduleInterview(id) {
    try {
        await apiRequest(`/applications/${id}/status`, {
            method: "PUT",
            body: JSON.stringify({ status: "Interview Pending Scheduling" })
        });
        window.location.href = `interview.html?applicationId=${encodeURIComponent(id)}`;
    } catch (error) {
        alert(error.message);
    }
}

document.getElementById("applyFilters").addEventListener("click", loadApplications);
loadApplications();
