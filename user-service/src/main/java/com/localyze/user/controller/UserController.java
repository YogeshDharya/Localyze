package com.localyze.user.controller;

import com.localyze.common.dto.response.ApiResponse;
import com.localyze.common.dto.response.UserResponse;
import com.localyze.user.dto.UpdateProfileRequest;
import com.localyze.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Profile Controller", description = "Endpoints for managing user profiles")
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get own profile")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile(
            @RequestHeader("X-User-Id") Long userId) {
        UserResponse response = userService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User fetched successfully", response));
    }

    @PutMapping("/me")
    @Operation(summary = "Update own profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateMyProfile(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody UpdateProfileRequest request) {
        UserResponse response = userService.updateUserProfile(userId, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PutMapping("/me/avatar")
    @Operation(summary = "Update avatar")
    public ResponseEntity<ApiResponse<UserResponse>> updateAvatar(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam String avatarUrl) {
        UserResponse response = userService.uploadAvatar(userId, avatarUrl);
        return ResponseEntity.ok(ApiResponse.success("Avatar updated successfully", response));
    }
}
