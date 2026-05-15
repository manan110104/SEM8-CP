package com.adite.recruitment.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String root() {
        return "redirect:/index.html";
    }

    @GetMapping("/apply")
    public String applyPage() {
        return "redirect:/candidate-home.html";
    }

    @GetMapping("/candidate.html")
    public String oldCandidatePage() {
        return "redirect:/candidate-home.html";
    }

    @GetMapping("/applications")
    public String applicationsPage() {
        return "redirect:/hr.html";
    }

    @GetMapping("/interviews")
    public String interviewsPage() {
        return "redirect:/interview.html";
    }

    @GetMapping("/jobs")
    public String jobsPage() {
        return "redirect:/jobs.html";
    }
}
