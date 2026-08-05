package com.localyze.controller;

import com.localyze.dto.response.ApiResponse;
import com.localyze.dto.response.PagedResponse;
import com.localyze.dto.response.ServiceResponse;
import com.localyze.dto.response.UserResponse;
import com.localyze.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<PagedResponse<UserResponse>> getUsers(
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getAllUsers(role, page, size));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse> updateUserStatus(
            @PathVariable Long id, @RequestBody Map<String, Boolean> request) {
        adminService.updateUserStatus(id, request.get("isActive"));
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("User status updated").build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/services")
    public ResponseEntity<PagedResponse<ServiceResponse>> getServices(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getAllServices(status, page, size));
    }

    @PutMapping("/services/{id}/status")
    public ResponseEntity<ApiResponse> updateServiceStatus(
            @PathVariable Long id, @RequestBody Map<String, String> request) {
        adminService.updateServiceStatus(id, request.get("status"));
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Service status updated").build());
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        adminService.deleteService(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }
}
