package com.localyze.auth_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.localyze.auth_service.dto.AuthResponse;
import com.localyze.auth_service.dto.LoginRequest;
import com.localyze.auth_service.dto.LogoutRequest;
import com.localyze.auth_service.dto.RefreshTokenRequest;
import com.localyze.auth_service.dto.RegisterRequest;
import com.localyze.auth_service.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/refresh-token")
	public ResponseEntity<AuthResponse> refreshToken(@RequestBody @Valid RefreshTokenRequest request) {

		return ResponseEntity.ok(authService.refreshToken(request));

	}

	@GetMapping("/me")
	public ResponseEntity<String> me(Authentication authentication) {
		return ResponseEntity.ok(authentication.getName());
	}

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
		return ResponseEntity.ok(authService.login(request));
	}

	@PostMapping("/logout")
	public ResponseEntity<String> logout(@RequestBody @Valid LogoutRequest request) {

		authService.logout(request);

		return ResponseEntity.ok("Logged out successfully");
	}

}
