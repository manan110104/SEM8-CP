package com.adite.recruitment.repository;

import com.adite.recruitment.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {
}
