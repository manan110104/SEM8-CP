async function loadJobs() {
    const tableBody = document.getElementById("jobsTableBody");
    const emptyState = document.getElementById("emptyState");
    try {
        const jobs = await apiRequest("/jobs");
        tableBody.innerHTML = "";
        if (!jobs.length) {
            emptyState.style.display = "block";
            return;
        }
        emptyState.style.display = "none";
        jobs.forEach((job) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${job.id}</td><td>${job.title}</td><td>${job.description}</td><td>${job.requiredSkills}</td>`;
            tableBody.appendChild(row);
        });
    } catch (error) {
        showToast(error.message, true);
    }
}

loadJobs();
