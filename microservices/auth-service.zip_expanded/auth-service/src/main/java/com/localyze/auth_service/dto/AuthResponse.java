package com.localyze.auth_service.dto;

import com.localyze.auth_service.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

	private Long userId;
	private String email;
	private Role role;
	private String accessToken;
	private String refreshToken;
	private String tokenType;

}
