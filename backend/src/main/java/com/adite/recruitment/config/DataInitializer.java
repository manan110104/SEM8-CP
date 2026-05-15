package com.adite.recruitment.config;

import com.adite.recruitment.entity.Job;
import com.adite.recruitment.entity.User;
import com.adite.recruitment.repository.JobRepository;
import com.adite.recruitment.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedData(UserRepository userRepository, JobRepository jobRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User hr = new User();
                hr.setName("HR Manager");
                hr.setEmail("hr@adite.com");
                hr.setPassword("hr123");
                hr.setRole("HR");
                userRepository.save(hr);

                User candidate = new User();
                candidate.setName("Demo Candidate");
                candidate.setEmail("candidate@adite.com");
                candidate.setPassword("candidate123");
                candidate.setRole("CANDIDATE");
                userRepository.save(candidate);

                User interviewer = new User();
                interviewer.setName("Demo Interviewer");
                interviewer.setEmail("interviewer@adite.com");
                interviewer.setPassword("interviewer123");
                interviewer.setRole("INTERVIEWER");
                userRepository.save(interviewer);
            }

            if (jobRepository.count() == 0) {
                Job job1 = new Job();
                job1.setTitle("Java Backend Intern");
                job1.setDescription("Work on Spring Boot APIs and database integration.");
                job1.setRequiredSkills("Java, Spring Boot, SQL");
                jobRepository.save(job1);

                Job job2 = new Job();
                job2.setTitle("Frontend Intern");
                job2.setDescription("Create clean web pages with HTML, CSS, and JavaScript.");
                job2.setRequiredSkills("HTML, CSS, JavaScript");
                jobRepository.save(job2);
            }
        };
    }
}
