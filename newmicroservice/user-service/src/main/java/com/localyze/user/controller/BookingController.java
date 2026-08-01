package com.localyze.user.controller;

import com.localyze.common.dto.request.BookingRequest;
import com.localyze.common.dto.response.ApiResponse;
import com.localyze.common.dto.response.BookingResponse;
import com.localyze.common.dto.response.PagedResponse;
import com.localyze.user.dto.ChangeBookingStatusRequest;
import com.localyze.user.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Booking Controller", description = "Endpoints for managing bookings")
public class BookingController {
    private final BookingService bookingService;

    @PostMapping("/")
    @Operation(summary = "Create a booking")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Email") String userEmail,
            @RequestBody BookingRequest request) {
        // Here we could pass user name properly if we fetch it, for now using email as placeholder name
        BookingResponse response = bookingService.createBooking(userId, userEmail, request);
        return ResponseEntity.ok(ApiResponse.success("Booking created successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        BookingResponse response = bookingService.getBookingById(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Booking fetched successfully", response));
    }

    @GetMapping("/my/customer")
    @Operation(summary = "Get my bookings as a customer")
    public ResponseEntity<ApiResponse<PagedResponse<BookingResponse>>> getMyBookingsAsCustomer(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<BookingResponse> response = bookingService.getMyBookingsAsCustomer(userId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Bookings fetched successfully", response));
    }

    @GetMapping("/my/provider")
    @Operation(summary = "Get my bookings as a provider")
    public ResponseEntity<ApiResponse<PagedResponse<BookingResponse>>> getMyBookingsAsProvider(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<BookingResponse> response = bookingService.getMyBookingsAsProvider(userId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Bookings fetched successfully", response));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update booking status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateStatus(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String userRole,
            @PathVariable Long id,
            @RequestBody ChangeBookingStatusRequest request) {
        BookingResponse response = bookingService.updateBookingStatus(id, request.getStatus(), userId, userRole);
        return ResponseEntity.ok(ApiResponse.success("Booking status updated successfully", response));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        BookingResponse response = bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", response));
    }
}
