package com.localyze.user.controller;

import com.localyze.common.dto.response.ApiResponse;
import com.localyze.common.dto.response.PagedResponse;
import com.localyze.common.dto.response.UserResponse;
import com.localyze.common.exception.UnauthorizedException;
import com.localyze.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin User Controller", description = "Admin endpoints for users")
public class AdminUserController {
    private final UserService userService;

    @GetMapping("/")
    @Operation(summary = "List all users")
    public ResponseEntity<ApiResponse<PagedResponse<UserResponse>>> getAllUsers(
            @RequestHeader("X-User-Role") String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (!"ADMIN".equals(role)) {
            throw new UnauthorizedException("Admin access required");
        }
        PagedResponse<UserResponse> response = userService.getAllUsers(page, size);
        return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate user")
    public ResponseEntity<ApiResponse<Void>> deactivateUser(
            @RequestHeader("X-User-Id") Long requesterId,
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id) {
        if (!"ADMIN".equals(role)) {
            throw new UnauthorizedException("Admin access required");
        }
        userService.deactivateUser(id, requesterId, role);
        return ResponseEntity.ok(ApiResponse.success("User deactivated successfully", null));
    }
}
