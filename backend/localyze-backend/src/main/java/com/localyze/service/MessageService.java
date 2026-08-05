public package com.localyze.service;

import com.localyze.dto.request.MessageRequest;
import com.localyze.dto.response.MessageResponse;
import com.localyze.entity.Booking;
import com.localyze.entity.Message;
import com.localyze.entity.User;
import com.localyze.exception.ResourceNotFoundException;
import com.localyze.exception.UnauthorizedException;
import com.localyze.mapper.MessageMapper;
import com.localyze.repository.BookingRepository;
import com.localyze.repository.MessageRepository;
import com.localyze.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Manages messages exchanged within the context of a booking
 * between the booking user and the service seller.
 */
@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final MessageMapper messageMapper;

    /**
     * Sends a message within a booking conversation.
     * The receiver is automatically determined — if the sender is the booking user,
     * the message goes to the seller, and vice versa.
     *
     * @param senderEmail the sender's email
     * @param request     the message request containing bookingId and content
     * @return the created message response
     * @throws UnauthorizedException if the sender is not part of the booking
     */
    @Transactional
    public MessageResponse sendMessage(String senderEmail, MessageRequest request) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", senderEmail));

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", request.getBookingId()));

        // Only the booking user and seller can send messages
        if (!booking.getUser().getEmail().equals(senderEmail)
                && !booking.getSeller().getEmail().equals(senderEmail)) {
            throw new UnauthorizedException("You don't have access to this booking");
        }

        // Determine receiver
        User receiver;
        if (sender.getId().equals(booking.getUser().getId())) {
            receiver = booking.getSeller();
        } else {
            receiver = booking.getUser();
        }

        Message message = Message.builder()
                .booking(booking)
                .sender(sender)
                .receiver(receiver)
                .content(request.getContent())
                .isRead(false)
                .build();

        return messageMapper.toResponse(messageRepository.save(message));
    }

    /**
     * Retrieves all messages for a booking, ordered by creation time.
     *
     * @param bookingId the booking ID
     * @param userEmail the authenticated user's email
     * @return list of message responses
     * @throws UnauthorizedException if the user is not part of the booking
     */
    @Transactional(readOnly = true)
    public List<MessageResponse> getBookingMessages(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (!booking.getUser().getEmail().equals(userEmail)
                && !booking.getSeller().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You don't have access to this booking");
        }

        return messageRepository.findByBookingIdOrderByCreatedAtAsc(bookingId).stream()
                .map(messageMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Marks a message as read. Only the intended receiver can mark it.
     *
     * @param messageId the message ID
     * @param userEmail the authenticated user's email
     * @throws UnauthorizedException if the user is not the receiver
     */
    @Transactional
    public void markAsRead(Long messageId, String userEmail) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message", "id", messageId));

        if (!message.getReceiver().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You can only mark your own messages as read");
        }

        message.setRead(true);
        messageRepository.save(message);
    }

    /**
     * Returns the count of unread messages for the authenticated user.
     *
     * @param userEmail the user's email
     * @return the number of unread messages
     */
    public long getUnreadCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));
        return messageRepository.countByReceiverIdAndIsReadFalse(user.getId());
    }
} {
    
}
