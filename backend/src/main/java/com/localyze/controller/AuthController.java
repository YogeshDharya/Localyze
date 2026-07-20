package com.localyze.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.localyze.dto.request.ForgotPasswordRequest;
import com.localyze.dto.request.LoginRequest;
import com.localyze.dto.request.PasswordResetRequest;
import com.localyze.dto.request.RegisterRequest;
import com.localyze.dto.response.ApiResponse;
import com.localyze.dto.response.AuthResponse;
import com.localyze.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
	
	
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(authService.refreshToken(request.get("refreshToken")));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse> verifyEmail(@RequestParam String token) {
        String message = authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message(message).build());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String message = authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message(message).build());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        String message = authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message(message).build());
    }
}
