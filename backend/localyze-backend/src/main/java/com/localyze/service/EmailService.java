package com.localyze.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;


@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendVerificationEmail(String to, String name, String token) {
        String subject = "Localyze - Verify Your Email";
        String verificationUrl = "http://localhost:5173/verify-email?token=" + token;
        String body = String.format(
                "<html><body>" +
                "<h2>Welcome to Localyze, %s!</h2>" +
                "<p>Please verify your email by clicking the link below:</p>" +
                "<a href='%s' style='padding:12px 24px;background:#3B82F6;color:white;text-decoration:none;border-radius:8px;'>Verify Email</a>" +
                "<p>Or copy this link: %s</p>" +
                "<p>This link expires in 24 hours.</p>" +
                "</body></html>",
                name, verificationUrl, verificationUrl
        );
        sendHtmlEmail(to, subject, body);
    }

    @Async
    public void sendPasswordResetEmail(String to, String name, String token) {
        String subject = "Localyze - Reset Your Password";
        String resetUrl = "http://localhost:5173/reset-password?token=" + token;
        String body = String.format(
                "<html><body>" +
                "<h2>Password Reset Request</h2>" +
                "<p>Hi %s, we received a request to reset your password.</p>" +
                "<a href='%s' style='padding:12px 24px;background:#3B82F6;color:white;text-decoration:none;border-radius:8px;'>Reset Password</a>" +
                "<p>Or copy this link: %s</p>" +
                "<p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>" +
                "</body></html>",
                name, resetUrl, resetUrl
        );
        sendHtmlEmail(to, subject, body);
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
