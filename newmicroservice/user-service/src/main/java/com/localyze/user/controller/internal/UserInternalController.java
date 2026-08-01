package com.localyze.user.controller.internal;

import com.localyze.common.dto.response.ApiResponse;
import com.localyze.common.dto.response.BookingResponse;
import com.localyze.common.dto.response.UserResponse;
import com.localyze.common.enums.BookingStatus;
import com.localyze.user.dto.CreateUserProfileRequest;
import com.localyze.user.service.BookingService;
import com.localyze.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/users")
@RequiredArgsConstructor
@Tag(name = "User Internal Controller", description = "Internal endpoints for inter-service communication")
public class UserInternalController {
    private final UserService userService;
    private final BookingService bookingService;

    @PostMapping("/profile")
    @Operation(summary = "Create user profile (Internal)")
    public ResponseEntity<ApiResponse<UserResponse>> createUserProfile(@RequestBody CreateUserProfileRequest request) {
        UserResponse response = userService.createUserProfile(request);
        return ResponseEntity.ok(ApiResponse.success("User profile created", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user profile by ID (Internal)")
    public ResponseEntity<ApiResponse<UserResponse>> getUserProfile(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User profile fetched", response));
    }

    @PatchMapping("/{bookingId}/booking-paid")
    @Operation(summary = "Mark booking as PAID (Internal)")
    public ResponseEntity<ApiResponse<BookingResponse>> markBookingPaid(@PathVariable Long bookingId) {
        // The requesterId and role can be anything for internal calls or we can bypass auth check inside service by adding a special method
        // For simplicity, we assume an internal user (e.g. system) or admin role
        BookingResponse response = bookingService.updateBookingStatus(bookingId, BookingStatus.CONFIRMED, 0L, "ADMIN");
        return ResponseEntity.ok(ApiResponse.success("Booking marked as CONFIRMED", response));
    }
}
