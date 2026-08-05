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
public class PaymentCapturedEvent {
    private Long paymentId;
    private Long bookingId;
    private Long userId;
    private String userEmail;
    private String userName;
    private BigDecimal amount;
    private String currency;
    private String razorpayPaymentId;
    private LocalDateTime capturedAt;
}
