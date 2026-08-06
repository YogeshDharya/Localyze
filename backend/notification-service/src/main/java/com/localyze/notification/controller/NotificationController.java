package com.localyze.notification.controller;

import com.localyze.common.dto.response.ApiResponse;
import com.localyze.notification.dto.EmailRequest;
import com.localyze.notification.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/internal/notify")
@RequiredArgsConstructor
@Tag(name = "Internal Notification", description = "Internal APIs for sending notifications")
public class NotificationController {

    private final EmailService emailService;

    @Operation(summary = "Send an email notification via internal request")
    @PostMapping("/email")
    public ResponseEntity<ApiResponse<String>> sendEmail(@Valid @RequestBody EmailRequest request) {
        if ("PASSWORD_RESET".equalsIgnoreCase(request.getType())) {
            String token = (request.getData() != null && request.getData().get("token") != null)
                    ? request.getData().get("token").toString() : "";
            emailService.sendPasswordResetEmail(request.getTo(), token);
        } else {
            emailService.sendEmail(request.getTo(), request.getSubject(), request.getHtmlBody());
        }
        
        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(true)
                .message("Email sending triggered successfully")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }
}
