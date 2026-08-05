package com.localyze.service;

import com.localyze.dto.request.*;
import com.localyze.dto.response.AuthResponse;
import com.localyze.entity.User;
import com.localyze.entity.enums.Role;
import com.localyze.exception.*;
import com.localyze.mapper.UserMapper;
import com.localyze.repository.UserRepository;
import com.localyze.security.JwtTokenProvider;

import ch.qos.logback.core.recovery.ResilientSyslogOutputStream;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Handles all authentication-related operations including registration,
 * login, token refresh, email verification, and password reset.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final UserMapper userMapper;

    /**
     * Registers a new user and returns JWT tokens.
     * Sends a verification email asynchronously.
     * In development mode, the user is auto-verified.
     *
     * @param request the registration request containing user details
     * @return authentication response with access and refresh tokens
     * @throws DuplicateResourceException if email or phone is already registered
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Phone number is already registered");
        }

        String verificationToken = UUID.randomUUID().toString();

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.valueOf(request.getRole().toUpperCase()))
                .verificationToken(verificationToken)
                .isVerified(false)
                .isActive(true)
                .build();

        userRepository.save(user);

        // Send verification email (non-blocking, catch errors)
        try {
            emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), verificationToken);
        } catch (Exception e) {
            // Log but don't fail registration
        }

        // For development, auto-verify and return tokens
        user.setVerified(true);
        userRepository.save(user);

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(userMapper.toResponse(user))
                .build();
    }

    /**
     * Authenticates a user with email and password, returning JWT tokens.
     *
     * @param request the login request containing credentials
     * @return authentication response with access and refresh tokens
     * @throws UnauthorizedException if account is deactivated
     */
    public AuthResponse login(LoginRequest request) {
    	System.out.println(request.getPassword());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));
        
    
        if (!user.isActive()) {
            throw new UnauthorizedException("Your account has been deactivated");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(userMapper.toResponse(user))
                .build();
    }

    /**
     * Generates new access and refresh tokens using a valid refresh token.
     *
     * @param refreshToken the current refresh token
     * @return authentication response with new tokens
     * @throws UnauthorizedException if the refresh token is invalid or expired
     */
    public AuthResponse refreshToken(String refreshToken) {
        try {
            String email = jwtTokenProvider.extractUsername(refreshToken);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

            if (jwtTokenProvider.isTokenExpired(refreshToken)) {
                throw new UnauthorizedException("Refresh token has expired");
            }

            String newAccessToken = jwtTokenProvider.generateAccessToken(user);
            String newRefreshToken = jwtTokenProvider.generateRefreshToken(user);

            return AuthResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .tokenType("Bearer")
                    .user(userMapper.toResponse(user))
                    .build();
        } catch (UnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }
    }

    /**
     * Verifies a user's email using the verification token.
     *
     * @param token the email verification token
     * @return success message
     * @throws BadRequestException if the token is invalid
     */
    @Transactional
    public String verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));
        user.setVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);
        return "Email verified successfully";
    }

    /**
     * Initiates the password reset flow by generating a reset token and sending an email.
     *
     * @param request the forgot password request containing the user's email
     * @return success message
     * @throws ResourceNotFoundException if no user exists with the given email
     */
    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), resetToken);
        } catch (Exception e) {
            // Log but don't fail
        }

        return "Password reset email sent";
    }

    /**
     * Resets the user's password using a valid reset token.
     *
     * @param request the password reset request containing the token and new password
     * @return success message
     * @throws BadRequestException if the token is invalid or expired
     */
    @Transactional
    public String resetPassword(PasswordResetRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return "Password reset successfully";
    }
}
