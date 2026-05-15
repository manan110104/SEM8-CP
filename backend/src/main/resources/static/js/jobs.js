async function loadJobs() {
    try {
        const jobs = await apiRequest("/jobs");
        const tableBody = document.getElementById("jobsTableBody");
        tableBody.innerHTML = "";

        jobs.forEach((job) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${job.id}</td>
                <td>${job.title}</td>
                <td>${job.description}</td>
                <td>${job.requiredSkills}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        alert(error.message);
    }
}

loadJobs();
