package com.adite.recruitment.controller;

import com.adite.recruitment.entity.JobApplication;
import com.adite.recruitment.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/api/apply")
    public ResponseEntity<JobApplication> apply(@RequestBody JobApplication application) {
        return ResponseEntity.ok(applicationService.apply(application));
    }

    @GetMapping("/api/applications")
    public ResponseEntity<List<JobApplication>> getApplications(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(applicationService.getApplications(skill, status));
    }

    @PutMapping("/api/applications/{id}/status")
    public ResponseEntity<JobApplication> updateStatus(@PathVariable Long id, @RequestBody StatusRequest request) {
        return ResponseEntity.ok(applicationService.updateStatus(id, request.status()));
    }

    @GetMapping("/api/candidate/home")
    public ResponseEntity<Map<String, Object>> candidateHome(@RequestParam String email) {
        return ResponseEntity.ok(applicationService.getCandidateHome(email));
    }

    public record StatusRequest(String status) {
    }
}
