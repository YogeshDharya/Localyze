package com.localyze.common.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingEvent {
    private String eventType;
    private Long bookingId;
    private Long customerId;
    private String customerEmail;
    private String customerName;
    private Long providerId;
    private String providerEmail;
    private String serviceTitle;
    private LocalDateTime scheduledAt;
    private BigDecimal totalAmount;
    private LocalDateTime occurredAt;
}
