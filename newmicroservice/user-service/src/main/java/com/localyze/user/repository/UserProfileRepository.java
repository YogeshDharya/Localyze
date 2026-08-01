package com.localyze.user.repository;

import com.localyze.common.enums.Role;
import com.localyze.user.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByEmail(String email);
    boolean existsByEmail(String email);
    List<UserProfile> findByRole(Role role);
}
