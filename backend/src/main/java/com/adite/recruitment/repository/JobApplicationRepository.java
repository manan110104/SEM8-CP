package com.adite.recruitment.repository;

import com.adite.recruitment.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findBySkillsContainingIgnoreCase(String skills);
    List<JobApplication> findByStatusIgnoreCase(String status);
    List<JobApplication> findBySkillsContainingIgnoreCaseAndStatusIgnoreCase(String skills, String status);
    List<JobApplication> findByEmailOrderByIdDesc(String email);
}
