package com.localyze.notification.service;

import com.localyze.common.event.BookingEvent;
import com.localyze.common.event.PaymentCapturedEvent;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${notification.mail.from:noreply@localyze.com}")
    private String fromEmail;

    @Value("${notification.mail.from-name:Localyze Platform}")
    private String fromName;

    public void sendEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            javaMailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage(), e);
        }
    }

    public void sendPasswordResetEmail(String to, String resetToken) {
        String subject = "Password Reset - Localyze Platform";
        String html = String.format(
                "<div style=\"font-family: Arial, sans-serif; padding: 20px;\">" +
                "<h2>Password Reset Request</h2>" +
                "<p>You have requested to reset your password. Use the token below to reset it:</p>" +
                "<p style=\"font-weight: bold; font-size: 18px; padding: 10px; background-color: #f4f4f4;\">%s</p>" +
                "<p>If you did not request this, please ignore this email.</p>" +
                "</div>", resetToken);
        sendEmail(to, subject, html);
    }

    public void sendWelcomeEmail(String to, String name) {
        String subject = "Welcome to Localyze!";
        String html = String.format(
                "<div style=\"font-family: Arial, sans-serif; padding: 20px;\">" +
                "<h2>Welcome, %s!</h2>" +
                "<p>Thank you for registering on the Localyze Platform. We are excited to have you on board!</p>" +
                "<p>Explore services, book professionals, and more.</p>" +
                "</div>", name != null ? name : to);
        sendEmail(to, subject, html);
    }

    public void sendBookingConfirmedEmail(BookingEvent event) {
        String subject = "Booking Confirmed - " + event.getBookingId();
        String html = String.format(
                "<div style=\"font-family: Arial, sans-serif; padding: 20px;\">" +
                "<h2>Booking Confirmed!</h2>" +
                "<p>Your booking (ID: %s) has been successfully confirmed.</p>" +
                "<p>Service: %s</p>" +
                "<p>Status: %s</p>" +
                "<p>Thank you for choosing Localyze.</p>" +
                "</div>", event.getBookingId(), event.getServiceTitle(), event.getEventType());
        sendEmail(event.getCustomerEmail(), subject, html);
    }

    public void sendBookingCancelledEmail(BookingEvent event) {
        String subject = "Booking Cancelled - " + event.getBookingId();
        String html = String.format(
                "<div style=\"font-family: Arial, sans-serif; padding: 20px;\">" +
                "<h2>Booking Cancelled</h2>" +
                "<p>Your booking (ID: %s) has been cancelled.</p>" +
                "<p>If you have any questions, please contact our support team.</p>" +
                "</div>", event.getBookingId());
        sendEmail(event.getCustomerEmail(), subject, html);
    }

    public void sendPaymentReceiptEmail(PaymentCapturedEvent event) {
        String subject = "Payment Receipt - " + event.getPaymentId();
        String html = String.format(
                "<div style=\"font-family: Arial, sans-serif; padding: 20px;\">" +
                "<h2>Payment Receipt</h2>" +
                "<p>Dear %s, thank you for your payment.</p>" +
                "<p>Payment ID: %s</p>" +
                "<p>Booking ID: %s</p>" +
                "<p>Amount: %s %s</p>" +
                "</div>", event.getUserName(), event.getPaymentId(), event.getBookingId(), event.getAmount(), event.getCurrency());

        String to = event.getUserEmail() != null ? event.getUserEmail() : "customer@example.com";
        sendEmail(to, subject, html);
    }
}
