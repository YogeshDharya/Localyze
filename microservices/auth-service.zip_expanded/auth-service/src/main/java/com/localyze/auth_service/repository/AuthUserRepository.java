package com.localyze.auth_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.localyze.auth_service.entity.AuthUser;

@Repository
public interface AuthUserRepository extends JpaRepository<AuthUser, Long> {

	Optional<AuthUser> findByEmail(String email);

	boolean existsByEmail(String email);

}
