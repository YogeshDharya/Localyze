package com.localyze.auth.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationRestClient {

    private final RestTemplate restTemplate;

    @Value("${notification.service.url}")
    private String notificationServiceUrl;

    public void sendResetPasswordEmail(String toEmail, String resetToken) {
        try {
            String url = notificationServiceUrl + "/internal/notify/email";
            Map<String, Object> request = Map.of(
                    "to", toEmail,
                    "subject", "Reset Your Localyze Password",
                    "type", "PASSWORD_RESET",
                    "data", Map.of("token", resetToken)
            );
            
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            log.info("Notification service response: {}", response.getStatusCode());
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
        }
    }
}
