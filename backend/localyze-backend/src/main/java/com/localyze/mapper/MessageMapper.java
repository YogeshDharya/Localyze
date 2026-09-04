package com.localyze.mapper;

import com.localyze.dto.response.MessageResponse;
import com.localyze.entity.Message;
import org.springframework.stereotype.Component;


@Component
public class MessageMapper {


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
