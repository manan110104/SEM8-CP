package com.adite.recruitment.repository;

import com.adite.recruitment.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAndRole(String email, String role);
    Optional<User> findByEmail(String email);
}
