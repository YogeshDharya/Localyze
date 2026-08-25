package com.localyze.payment.controller;

import com.localyze.common.dto.request.PaymentVerificationRequest;
import com.localyze.common.dto.response.ApiResponse;
import com.localyze.common.dto.response.PaymentResponse;
import com.localyze.payment.dto.CreateOrderRequest;
import com.localyze.payment.dto.CreateOrderResponse;
import com.localyze.payment.service.RazorpayService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Endpoints for Razorpay integration")
public class PaymentController {

    private final RazorpayService razorpayService;

    @PostMapping("/create-order")
    @Operation(summary = "Create a Razorpay order")
    public ResponseEntity<ApiResponse<CreateOrderResponse>> createOrder(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody CreateOrderRequest request) {
        CreateOrderResponse response = razorpayService.createOrder(userId, request);
        return ResponseEntity.ok(ApiResponse.<CreateOrderResponse>builder()
                .success(true)
                .message("Razorpay order created successfully")
                .data(response)
                .build());
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify Razorpay payment signature")
    public ResponseEntity<ApiResponse<PaymentResponse>> verifyPayment(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader(value = "X-User-Name", required = false) String userName,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @Valid @RequestBody PaymentVerificationRequest request) {
        PaymentResponse response = razorpayService.verifyAndCapturePayment(userId, userName, userEmail, request);
        return ResponseEntity.ok(ApiResponse.<PaymentResponse>builder()
                .success(true)
                .message("Payment verified and captured successfully")
                .data(response)
                .build());
    }

    @GetMapping("/my")
    @Operation(summary = "Get payments for the authenticated user")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getMyPayments(
            @RequestHeader("X-User-Id") Long userId) {
        List<PaymentResponse> responses = razorpayService.getPaymentsByUser(userId);
        return ResponseEntity.ok(ApiResponse.<List<PaymentResponse>>builder()
                .success(true)
                .message("Fetched user payments")
                .data(responses)
                .build());
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get payment details for a specific booking")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByBooking(
            @PathVariable Long bookingId) {
        PaymentResponse response = razorpayService.getPaymentByBooking(bookingId);
        return ResponseEntity.ok(ApiResponse.<PaymentResponse>builder()
                .success(true)
                .message("Fetched payment details for booking")
                .data(response)
                .build());
    }
}
