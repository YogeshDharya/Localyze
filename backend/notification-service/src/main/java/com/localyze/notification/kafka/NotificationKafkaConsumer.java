package com.localyze.notification.kafka;

import com.localyze.common.event.BookingEvent;
import com.localyze.common.event.PaymentCapturedEvent;
import com.localyze.common.event.UserRegisteredEvent;
import com.localyze.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationKafkaConsumer {

    private final EmailService emailService;

    @KafkaListener(topics = "localyze.user.registered", groupId = "notification-service-group",
        containerFactory = "userRegisteredKafkaListenerContainerFactory")
    public void onUserRegistered(UserRegisteredEvent event) {
        log.info("Received UserRegisteredEvent: {}", event);
        emailService.sendWelcomeEmail(event.getEmail(), event.getName());
    }

    @KafkaListener(topics = "localyze.booking.confirmed", groupId = "notification-service-group",
        containerFactory = "bookingEventKafkaListenerContainerFactory")
    public void onBookingConfirmed(BookingEvent event) {
        log.info("Received BookingConfirmedEvent for Booking: {}", event.getBookingId());
        emailService.sendBookingConfirmedEmail(event);
    }

    @KafkaListener(topics = "localyze.booking.cancelled", groupId = "notification-service-group",
        containerFactory = "bookingEventKafkaListenerContainerFactory")
    public void onBookingCancelled(BookingEvent event) {
        log.info("Received BookingCancelledEvent for Booking: {}", event.getBookingId());
        emailService.sendBookingCancelledEmail(event);
    }

    @KafkaListener(topics = "localyze.payment.captured", groupId = "notification-service-group",
        containerFactory = "paymentCapturedKafkaListenerContainerFactory")
    public void onPaymentCaptured(PaymentCapturedEvent event) {
        log.info("Received PaymentCapturedEvent for Payment: {}", event.getPaymentId());
        emailService.sendPaymentReceiptEmail(event);
    }
}
