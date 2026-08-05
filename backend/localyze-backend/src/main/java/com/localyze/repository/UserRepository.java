package com.localyze.repository;

import com.localyze.entity.User;
import com.localyze.entity.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    Optional<User> findByVerificationToken(String token);

    Optional<User> findByResetToken(String token);

    Page<User> findByRole(Role role, Pageable pageable);

    long countByRole(Role role);
}
