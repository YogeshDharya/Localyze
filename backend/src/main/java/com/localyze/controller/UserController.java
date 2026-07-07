package com.localyze.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.localyze.dto.request.ChangePasswordRequest;
import com.localyze.dto.request.UpdateProfileRequest;
import com.localyze.dto.response.ApiResponse;
import com.localyze.dto.response.UserResponse;
import com.localyze.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getCurrentUser(userDetails.getUsername()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(userDetails.getUsername(), request));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Password changed successfully").build());
    }

    @PutMapping("/me/location")
    public ResponseEntity<ApiResponse> updateLocation(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Double> request) {
        userService.updateLocation(userDetails.getUsername(), request.get("latitude"), request.get("longitude"));
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Location updated").build());
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse> deactivateAccount(@AuthenticationPrincipal UserDetails userDetails) {
        userService.deactivateAccount(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Account deactivated").build());
    }
}
