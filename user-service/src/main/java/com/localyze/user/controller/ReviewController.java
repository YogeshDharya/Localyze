package com.localyze.user.controller;

import com.localyze.common.dto.request.ReviewRequest;
import com.localyze.common.dto.response.ApiResponse;
import com.localyze.common.dto.response.PagedResponse;
import com.localyze.common.dto.response.ReviewResponse;
import com.localyze.user.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Review Controller", description = "Endpoints for managing reviews")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/")
    @Operation(summary = "Create a review")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Email") String userEmail,
            @RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.createReview(userId, userEmail, request);
        return ResponseEntity.ok(ApiResponse.success("Review created successfully", response));
    }

    @GetMapping("/service/{serviceId}")
    @Operation(summary = "Get reviews for a service")
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getReviewsByService(
            @PathVariable Long serviceId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<ReviewResponse> response = reviewService.getReviewsByService(serviceId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Reviews fetched successfully", response));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get reviews by user")
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getReviewsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<ReviewResponse> response = reviewService.getReviewsByUser(userId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Reviews fetched successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a review")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String userRole,
            @PathVariable Long id) {
        reviewService.deleteReview(id, userId, userRole);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully", null));
    }
}
