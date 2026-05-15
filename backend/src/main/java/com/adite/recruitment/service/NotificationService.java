package com.adite.recruitment.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String fromEmail;

    public NotificationService(
            @Autowired(required = false) JavaMailSender mailSender,
            @Value("${app.mail.enabled:false}") boolean enabled,
            @Value("${spring.mail.username:}") String fromEmail
    ) {
        this.mailSender = mailSender;
        this.enabled = enabled && mailSender != null;
        this.fromEmail = fromEmail;
    }

    public void sendShortlistEmail(String candidateEmail, String candidateName, Long applicationId) {
        send(
                candidateEmail,
                "Application Shortlisted - Adite Technologies",
                "Hello " + candidateName + ",\n\n"
                        + "Your application #" + applicationId + " has been shortlisted by HR.\n"
                        + "Please check your candidate dashboard for updates.\n\n"
                        + "Regards,\nAdite Technologies Recruitment Team"
        );
    }

    public void sendRejectionEmail(String candidateEmail, String candidateName, Long applicationId) {
        send(
                candidateEmail,
                "Application Update - Adite Technologies",
                "Hello " + candidateName + ",\n\n"
                        + "Thank you for applying. Your application #" + applicationId
                        + " was not selected at this time.\n"
                        + "We encourage you to apply again in the future.\n\n"
                        + "Regards,\nAdite Technologies Recruitment Team"
        );
    }

    public void sendInterviewScheduledToCandidate(
            String candidateEmail,
            String candidateName,
            Long applicationId,
            String dateTime,
            String interviewerEmail,
            String notes
    ) {
        send(
                candidateEmail,
                "Interview Scheduled - Adite Technologies",
                "Hello " + candidateName + ",\n\n"
                        + "Your interview for application #" + applicationId + " is scheduled.\n"
                        + "Date & Time: " + dateTime + "\n"
                        + "Interviewer Email: " + interviewerEmail + "\n"
                        + "Notes: " + notes + "\n\n"
                        + "Regards,\nAdite Technologies Recruitment Team"
        );
    }

    public void sendInterviewAssignedToInterviewer(
            String interviewerEmail,
            String candidateName,
            Long applicationId,
            String dateTime,
            String notes
    ) {
        send(
                interviewerEmail,
                "Interview Assignment - Adite Technologies",
                "Hello,\n\n"
                        + "You are assigned to interview candidate " + candidateName
                        + " (Application #" + applicationId + ").\n"
                        + "Date & Time: " + dateTime + "\n"
                        + "Notes: " + notes + "\n\n"
                        + "Please check your interviewer dashboard.\n\n"
                        + "Regards,\nAdite Technologies Recruitment Team"
        );
    }

    private void send(String to, String subject, String body) {
        if (!enabled) {
            log.info("Email skipped (disabled): {} -> {}", subject, to);
            return;
        }
        if (to == null || to.isBlank()) {
            log.warn("Email skipped (empty recipient): {}", subject);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (fromEmail != null && !fromEmail.isBlank()) {
                message.setFrom(fromEmail);
            }
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent: {} -> {}", subject, to);
        } catch (Exception ex) {
            log.warn("Email failed for {}: {}", to, ex.getMessage());
        }
    }
}
