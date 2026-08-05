package com.localyze.mapper;

import com.localyze.dto.response.MessageResponse;
import com.localyze.entity.Message;
import org.springframework.stereotype.Component;

/**
 * Maps Message entity to MessageResponse DTO.
 */
@Component
public class MessageMapper {

    /**
     * Converts a Message entity to a MessageResponse DTO.
     *
     * @param message the message entity
     * @return the message response DTO
     */
    public MessageResponse toResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .bookingId(message.getBooking().getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFullName())
                .receiverId(message.getReceiver().getId())
                .receiverName(message.getReceiver().getFullName())
                .content(message.getContent())
                .isRead(message.isRead())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
