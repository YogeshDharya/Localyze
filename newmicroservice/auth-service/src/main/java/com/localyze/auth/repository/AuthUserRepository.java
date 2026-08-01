package com.localyze.auth.repository;

import com.localyze.auth.entity.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AuthUserRepository extends JpaRepository<AuthUser, Long> {
    Optional<AuthUser> findByEmail(String email);
    Optional<AuthUser> findByResetToken(String resetToken);
    boolean existsByEmail(String email);
}
