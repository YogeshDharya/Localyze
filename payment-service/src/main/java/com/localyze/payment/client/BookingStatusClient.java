package com.localyze.payment.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingStatusClient {
    private final WebClient.Builder webClientBuilder;
    
    @Value("${user.service.url}")
    private String userServiceUrl;

    public void markBookingAsPaid(Long bookingId) {
        log.info("Calling user-service to mark booking as paid: {}", bookingId);
        webClientBuilder.build()
                .patch()
                .uri(userServiceUrl + "/api/internal/users/bookings/" + bookingId + "/paid")
                .retrieve()
                .bodyToMono(Void.class)
                .onErrorResume(e -> {
                    log.error("Failed to mark booking as paid via user-service", e);
                    return Mono.empty();
                })
                .block();
    }
}
