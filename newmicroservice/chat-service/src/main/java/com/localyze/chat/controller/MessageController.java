package com.localyze.chat.controller;

import com.localyze.chat.service.MessageService;
import com.localyze.common.dto.request.MessageRequest;
import com.localyze.common.dto.response.ApiResponse;
import com.localyze.common.dto.response.MessageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Tag(name = "Chat", description = "Messaging APIs")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    @Operation(summary = "Send a message")
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody MessageRequest request) {
        MessageResponse response = messageService.sendMessage(userId, request);
        return ResponseEntity.ok(ApiResponse.<MessageResponse>builder()
                .success(true)
                .message("Message sent successfully")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build());
    }

    @GetMapping("/conversation/{otherUserId}")
    @Operation(summary = "Get conversation with another user")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getConversation(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long otherUserId) {
        List<MessageResponse> conversation = messageService.getConversation(userId, otherUserId);
        return ResponseEntity.ok(ApiResponse.<List<MessageResponse>>builder()
                .success(true)
                .message("Conversation retrieved successfully")
                .data(conversation)
                .timestamp(LocalDateTime.now())
                .build());
    }

    @GetMapping("/partners")
    @Operation(summary = "Get conversation partners")
    public ResponseEntity<ApiResponse<List<Long>>> getPartners(
            @RequestHeader("X-User-Id") Long userId) {
        List<Long> partners = messageService.getConversationPartners(userId);
        return ResponseEntity.ok(ApiResponse.<List<Long>>builder()
                .success(true)
                .message("Conversation partners retrieved successfully")
                .data(partners)
                .timestamp(LocalDateTime.now())
                .build());
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread message count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @RequestHeader("X-User-Id") Long userId) {
        long count = messageService.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.<Long>builder()
                .success(true)
                .message("Unread count retrieved successfully")
                .data(count)
                .timestamp(LocalDateTime.now())
                .build());
    }

    @PutMapping("/{messageId}/read")
    @Operation(summary = "Mark message as read")
    public ResponseEntity<ApiResponse<MessageResponse>> markAsRead(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long messageId) {
        MessageResponse response = messageService.markAsRead(messageId, userId);
        return ResponseEntity.ok(ApiResponse.<MessageResponse>builder()
                .success(true)
                .message("Message marked as read")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build());
    }
}
