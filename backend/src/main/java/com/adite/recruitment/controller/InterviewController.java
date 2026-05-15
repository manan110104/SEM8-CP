package com.adite.recruitment.controller;

import com.adite.recruitment.entity.Interview;
import com.adite.recruitment.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping
    public ResponseEntity<Interview> scheduleInterview(@RequestBody Map<String, Object> request) {
        Interview interview = new Interview();
        Object appId = request.get("applicationId");
        if (appId == null) {
            throw new RuntimeException("applicationId is required");
        }
        interview.setApplicationId(Long.valueOf(String.valueOf(appId)));

        String interviewerEmail = stringOrNull(request.get("interviewerEmail"));
        String interviewerName = stringOrNull(request.get("interviewerName"));
        if (interviewerEmail == null || interviewerEmail.isBlank()) {
            // Backward compatibility for older UIs that may send only interviewerName
            interviewerEmail = interviewerName;
        }
        if (interviewerEmail == null || interviewerEmail.isBlank()) {
            throw new RuntimeException("interviewerEmail is required");
        }
        interview.setInterviewerEmail(interviewerEmail);
        interview.setInterviewerName(interviewerEmail);

        String notes = stringOrNull(request.get("notes"));
        if (notes == null || notes.isBlank()) {
            // Backward compatibility for older UIs that send feedback
            notes = stringOrNull(request.get("feedback"));
        }
        if (notes == null || notes.isBlank()) {
            throw new RuntimeException("notes is required");
        }
        interview.setNotes(notes);

        String interviewDateTime = stringOrNull(request.get("interviewDateTime"));
        if (interviewDateTime != null && !interviewDateTime.isBlank()) {
            interview.setInterviewDateTime(LocalDateTime.parse(interviewDateTime));
        } else {
            // Backward compatibility for older UIs that send date
            String date = stringOrNull(request.get("date"));
            if (date == null || date.isBlank()) {
                throw new RuntimeException("interviewDateTime is required");
            }
            interview.setInterviewDateTime(LocalDate.parse(date).atStartOfDay());
        }

        return ResponseEntity.ok(interviewService.scheduleInterview(interview));
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<List<Interview>> getInterviewsByApplicationId(@PathVariable Long applicationId) {
        return ResponseEntity.ok(interviewService.getByApplicationId(applicationId));
    }

    @GetMapping("/home")
    public ResponseEntity<Map<String, Object>> interviewerHome(@RequestParam String email) {
        return ResponseEntity.ok(interviewService.getInterviewerHome(email));
    }

    private String stringOrNull(Object value) {
        return value == null ? null : String.valueOf(value).trim();
    }
}
