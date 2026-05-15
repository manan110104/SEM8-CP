package com.adite.recruitment.service;

import com.adite.recruitment.entity.Interview;
import com.adite.recruitment.entity.JobApplication;
import com.adite.recruitment.entity.User;
import com.adite.recruitment.repository.InterviewRepository;
import com.adite.recruitment.repository.JobApplicationRepository;
import com.adite.recruitment.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public InterviewService(
            InterviewRepository interviewRepository,
            JobApplicationRepository jobApplicationRepository,
            UserRepository userRepository,
            NotificationService notificationService
    ) {
        this.interviewRepository = interviewRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Interview scheduleInterview(Interview interview) {
        if (interview.getInterviewerEmail() == null || interview.getInterviewerEmail().isBlank()) {
            throw new RuntimeException("Interviewer email is required");
        }
        String normalizedEmail = interview.getInterviewerEmail().trim().toLowerCase();
        userRepository.findByEmailAndRole(normalizedEmail, "INTERVIEWER")
                .orElseThrow(() -> new RuntimeException(
                        "Interviewer not registered. Ask interviewer to register with email: " + normalizedEmail
                ));

        interview.setInterviewerEmail(normalizedEmail);
        interview.setInterviewerName(normalizedEmail);

        JobApplication application = jobApplicationRepository.findById(interview.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus("Interview Scheduled");
        jobApplicationRepository.save(application);

        Interview saved = interviewRepository.save(interview);

        String dateTime = String.valueOf(saved.getInterviewDateTime());
        notificationService.sendInterviewScheduledToCandidate(
                application.getEmail(),
                application.getCandidateName(),
                application.getId(),
                dateTime,
                normalizedEmail,
                saved.getNotes()
        );
        notificationService.sendInterviewAssignedToInterviewer(
                normalizedEmail,
                application.getCandidateName(),
                application.getId(),
                dateTime,
                saved.getNotes()
        );

        return saved;
    }

    public List<Interview> getByApplicationId(Long applicationId) {
        return interviewRepository.findByApplicationId(applicationId);
    }

    public Map<String, Object> getInterviewerHome(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        List<Interview> interviews = interviewRepository.findByInterviewerEmailOrderByInterviewDateTimeDesc(normalizedEmail);
        List<String> notifications = new ArrayList<>();
        for (Interview interview : interviews) {
            Optional<JobApplication> app = jobApplicationRepository.findById(interview.getApplicationId());
            if (app.isPresent()) {
                notifications.add("Application #" + interview.getApplicationId()
                        + ": " + app.get().getCandidateName()
                        + " | Status: " + app.get().getStatus()
                        + " | Interview at " + interview.getInterviewDateTime() + ".");
            } else {
                notifications.add("Application #" + interview.getApplicationId()
                        + ": Interview at " + interview.getInterviewDateTime() + ".");
            }
        }
        return Map.of(
                "email", normalizedEmail,
                "interviews", interviews,
                "notifications", notifications,
                "message", interviews.isEmpty()
                        ? "No interviews assigned yet."
                        : "Interview schedule is shown below."
        );
    }
}
