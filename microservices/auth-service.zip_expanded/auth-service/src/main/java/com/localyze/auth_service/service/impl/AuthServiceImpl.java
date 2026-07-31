package com.localyze.auth_service.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.localyze.auth_service.dto.AuthResponse;
import com.localyze.auth_service.dto.LoginRequest;
import com.localyze.auth_service.dto.LogoutRequest;
import com.localyze.auth_service.dto.RefreshTokenRequest;
import com.localyze.auth_service.dto.RegisterRequest;
import com.localyze.auth_service.entity.AuthUser;
import com.localyze.auth_service.exception.EmailAlreadyExistsException;
import com.localyze.auth_service.repository.AuthUserRepository;
import com.localyze.auth_service.security.JwtService;
import com.localyze.auth_service.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final AuthUserRepository authUserRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;

	@Override
	public AuthResponse register(RegisterRequest request) {
		if (authUserRepository.existsByEmail(request.getEmail())) {
			throw new EmailAlreadyExistsException("email already exists");
		}

		AuthUser authUser = AuthUser.builder().email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword())).role(request.getRole()).enabled(true)
				.emailVerified(false).build();

		authUser = authUserRepository.save(authUser);

		String accessToken = jwtService.generateToken(authUser);
		String refreshToken = jwtService.generateRefreshToken(authUser);

		authUser.setRefreshToken(refreshToken);
		authUser = authUserRepository.save(authUser);

		return AuthResponse.builder().userId(authUser.getId()).email(authUser.getEmail()).role(authUser.getRole())
				.accessToken(accessToken).refreshToken(refreshToken).tokenType("Bearer").build();
	}

	@Override
	public AuthResponse login(LoginRequest request) {

		authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

		AuthUser authUser = authUserRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));

		String accessToken = jwtService.generateToken(authUser);
		String refreshToken = jwtService.generateRefreshToken(authUser);

		authUser.setRefreshToken(refreshToken);
		authUser = authUserRepository.save(authUser);

		return AuthResponse.builder().userId(authUser.getId()).email(authUser.getEmail()).role(authUser.getRole())
				.accessToken(accessToken).refreshToken(refreshToken).tokenType("Bearer").build();
	}

	@Override
	public AuthResponse refreshToken(RefreshTokenRequest request) {

		String refreshToken = request.getRefreshToken();
		String email = jwtService.extractUsername(refreshToken);

		AuthUser authUser = authUserRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("user not found"));

		if (!refreshToken.equals(authUser.getRefreshToken())) {
			throw new RuntimeException("Invalid refresh token");
		}

		if (!jwtService.isTokenValid(refreshToken, authUser)) {
			throw new RuntimeException("refresh token expired");
		}

		String accessToken = jwtService.generateToken(authUser);

		return AuthResponse.builder().userId(authUser.getId()).email(authUser.getEmail()).role(authUser.getRole())
				.accessToken(accessToken).refreshToken(refreshToken).tokenType("Bearer").build();
	}

	@Override
	public void logout(LogoutRequest request) {
		// TODO Auto-generated method stub
		String email = jwtService.extractUsername(request.getRefreshToken());
		AuthUser user = authUserRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("user not found"));
		
		
		user.setRefreshToken(null);
		authUserRepository.save(user);
	}

}
