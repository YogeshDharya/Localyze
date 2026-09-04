package com.localyze.controller;

import com.localyze.dto.request.MessageRequest;
import com.localyze.dto.response.ApiResponse;
import com.localyze.dto.response.MessageResponse;
import com.localyze.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody MessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(messageService.sendMessage(userDetails.getUsername(), request));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<MessageResponse>> getBookingMessages(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(messageService.getBookingMessages(bookingId, userDetails.getUsername()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        messageService.markAsRead(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Message marked as read").build());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(Map.of("count", messageService.getUnreadCount(userDetails.getUsername())));
    }
}
