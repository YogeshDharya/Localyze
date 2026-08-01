package com.localyze.auth_service.service;

import com.localyze.auth_service.dto.AuthResponse;
import com.localyze.auth_service.dto.LoginRequest;
import com.localyze.auth_service.dto.LogoutRequest;
import com.localyze.auth_service.dto.RefreshTokenRequest;
import com.localyze.auth_service.dto.RegisterRequest;

public interface AuthService {

	AuthResponse register(RegisterRequest request);
	
	AuthResponse login(LoginRequest request);
	
	AuthResponse refreshToken(RefreshTokenRequest request);

	void logout(LogoutRequest request);
	
}
