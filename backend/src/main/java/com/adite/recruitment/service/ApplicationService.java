package com.adite.recruitment.service;

import com.adite.recruitment.entity.JobApplication;
import com.adite.recruitment.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final NotificationService notificationService;

    public ApplicationService(
            JobApplicationRepository jobApplicationRepository,
            NotificationService notificationService
    ) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.notificationService = notificationService;
    }

    public JobApplication apply(JobApplication application) {
        application.setStatus("Applied");
        return jobApplicationRepository.save(application);
    }

    public List<JobApplication> getApplications(String skill, String status) {
        boolean hasSkill = skill != null && !skill.isBlank();
        boolean hasStatus = status != null && !status.isBlank();

        if (hasSkill && hasStatus) {
            return jobApplicationRepository.findBySkillsContainingIgnoreCaseAndStatusIgnoreCase(skill, status);
        }
        if (hasSkill) {
            return jobApplicationRepository.findBySkillsContainingIgnoreCase(skill);
        }
        if (hasStatus) {
            return jobApplicationRepository.findByStatusIgnoreCase(status);
        }
        return jobApplicationRepository.findAll();
    }

    public JobApplication updateStatus(Long id, String status) {
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
        application.setStatus(status);
        JobApplication saved = jobApplicationRepository.save(application);

        if ("Shortlisted".equalsIgnoreCase(status)) {
            notificationService.sendShortlistEmail(
                    saved.getEmail(),
                    saved.getCandidateName(),
                    saved.getId()
            );
        } else if ("Rejected".equalsIgnoreCase(status)) {
            notificationService.sendRejectionEmail(
                    saved.getEmail(),
                    saved.getCandidateName(),
                    saved.getId()
            );
        }

        return saved;
    }

    public List<JobApplication> getApplicationsByEmail(String email) {
        return jobApplicationRepository.findByEmailOrderByIdDesc(email);
    }

    public Map<String, Object> getCandidateHome(String email) {
        List<JobApplication> applications = getApplicationsByEmail(email);
        List<String> notifications = new ArrayList<>();
        for (JobApplication app : applications) {
            notifications.add(buildCandidateNotification(app));
        }
        return Map.of(
                "email", email,
                "applications", applications,
                "notifications", notifications,
                "message", applications.isEmpty()
                        ? "No applications found. Apply for a job to get updates."
                        : "Status and interview updates are shown below."
        );
    }

    private String buildCandidateNotification(JobApplication app) {
        if ("Shortlisted".equalsIgnoreCase(app.getStatus())) {
            return "Application #" + app.getId() + ": HR shortlisted your profile.";
        }
        if ("Rejected".equalsIgnoreCase(app.getStatus())) {
            return "Application #" + app.getId() + ": HR rejected your profile.";
        }
        if ("Selected".equalsIgnoreCase(app.getStatus())) {
            return "Application #" + app.getId() + ": Congratulations! You are selected.";
        }
        if ("Interview Scheduled".equalsIgnoreCase(app.getStatus())) {
            return "Application #" + app.getId() + ": HR scheduled your interview.";
        }
        if ("Interview Pending Scheduling".equalsIgnoreCase(app.getStatus())) {
            return "Application #" + app.getId() + ": HR requested interview scheduling.";
        }
        return "Application #" + app.getId() + ": status is " + app.getStatus() + ".";
    }
}
