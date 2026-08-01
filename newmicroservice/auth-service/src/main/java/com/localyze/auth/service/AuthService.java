package com.localyze.auth.service;

import com.localyze.auth.client.NotificationRestClient;
import com.localyze.auth.dto.ForgotPasswordRequest;
import com.localyze.auth.dto.ResetPasswordRequest;
import com.localyze.auth.entity.AuthUser;
import com.localyze.auth.kafka.UserRegisteredEventProducer;
import com.localyze.auth.repository.AuthUserRepository;
import com.localyze.common.dto.request.LoginRequest;
import com.localyze.common.dto.request.RegisterRequest;
import com.localyze.common.dto.response.AuthResponse;
import com.localyze.common.enums.Role;
import com.localyze.common.event.UserRegisteredEvent;
import com.localyze.common.exception.DuplicateResourceException;
import com.localyze.common.exception.UnauthorizedException;
import com.localyze.common.exception.BadRequestException;
import com.localyze.common.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthUserRepository authUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRegisteredEventProducer eventProducer;
    private final NotificationRestClient notificationClient;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (authUserRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User with email already exists");
        }

        AuthUser user = AuthUser.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.CUSTOMER)
                .enabled(true)
                .build();

        AuthUser savedUser = authUserRepository.save(user);

        UserRegisteredEvent event = new UserRegisteredEvent();
        event.setUserId(savedUser.getId());
        event.setEmail(savedUser.getEmail());
        event.setRole(savedUser.getRole().name());
        eventProducer.publish(event);

        String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getRole().name(), savedUser.getId());

        return new AuthResponse(token, "Bearer",  savedUser.getEmail(), savedUser.getRole().name(), savedUser.getId(), 86400000L);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        AuthUser user = authUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        if (!user.isEnabled()) {
            throw new UnauthorizedException("Account is disabled");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        return new AuthResponse(token, "Bearer",  user.getEmail(), user.getRole().name(), user.getId(), 86400000L);
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        Optional<AuthUser> userOpt = authUserRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            AuthUser user = userOpt.get();
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(24));
            authUserRepository.save(user);

            notificationClient.sendResetPasswordEmail(user.getEmail(), token);
        } else {
            log.info("Password reset requested for non-existent email: {}", request.getEmail());
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        AuthUser user = authUserRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Invalid or expired reset token");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        authUserRepository.save(user);
    }
}
