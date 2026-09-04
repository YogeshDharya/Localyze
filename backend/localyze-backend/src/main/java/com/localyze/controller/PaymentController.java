package com.localyze.controller;

import com.localyze.dto.request.PaymentVerificationRequest;
import com.localyze.dto.response.PaymentResponse;
import com.localyze.service.RazorpayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayService razorpayService;

    @PostMapping("/create-order")
    public ResponseEntity<PaymentResponse> createOrder(
            @RequestBody Map<String, Long> request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(razorpayService.createOrder(request.get("bookingId"), userDetails.getUsername()));
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(
            @Valid @RequestBody PaymentVerificationRequest request) {
        return ResponseEntity.ok(razorpayService.verifyPayment(request));
    }

//    @GetMapping("/booking/{bookingId}")
//    public ResponseEntity<PaymentResponse> getPaymentByBooking(
//            @PathVariable Long bookingId,
//            @AuthenticationPrincipal UserDetails userDetails) {
//        return ResponseEntity.ok(razorpayService.getPaymentByBooking(bookingId, userDetails.getUsername()));
//    }
}
