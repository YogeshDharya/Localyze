package com.localyze.chat.service;

import com.localyze.chat.entity.Message;
import com.localyze.chat.repository.MessageRepository;
import com.localyze.common.dto.request.MessageRequest;
import com.localyze.common.dto.response.MessageResponse;
import com.localyze.common.exception.ResourceNotFoundException;
import com.localyze.common.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageService {

    private final MessageRepository messageRepository;

    @Transactional
    public MessageResponse sendMessage(Long senderId, MessageRequest request) {
        log.info("User {} sending message to User {}", senderId, request.getReceiverId());
        
        Message message = Message.builder()
                .senderId(senderId)
                .receiverId(request.getReceiverId())
                .content(request.getContent())
                .read(false)
                .build();
                
        Message savedMessage = messageRepository.save(message);
        return toResponse(savedMessage);
    }

    @Transactional
    public List<MessageResponse> getConversation(Long currentUserId, Long otherUserId) {
        log.info("Fetching conversation between User {} and User {}", currentUserId, otherUserId);
        
        List<Message> messages = messageRepository.findConversation(currentUserId, otherUserId);
        
        // Mark messages as read if current user is the receiver
        boolean updated = false;
        for (Message message : messages) {
            if (message.getReceiverId().equals(currentUserId) && !message.isRead()) {
                message.setRead(true);
                updated = true;
            }
        }
        
        if (updated) {
            messageRepository.saveAll(messages);
        }
        
        return messages.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Long> getConversationPartners(Long userId) {
        log.info("Fetching conversation partners for User {}", userId);
        return messageRepository.findConversationPartners(userId);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        log.info("Fetching unread message count for User {}", userId);
        return messageRepository.countByReceiverIdAndReadFalse(userId);
    }

    @Transactional
    public MessageResponse markAsRead(Long messageId, Long userId) {
        log.info("User {} marking message {} as read", userId, messageId);
        
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with ID: " + messageId));
                
        if (!message.getReceiverId().equals(userId)) {
            throw new UnauthorizedException("Only the receiver can mark a message as read");
        }
        
        message.setRead(true);
        Message savedMessage = messageRepository.save(message);
        return toResponse(savedMessage);
    }

    private MessageResponse toResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .senderId(message.getSenderId())
                .receiverId(message.getReceiverId())
                .content(message.getContent())
                .read(message.isRead())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
