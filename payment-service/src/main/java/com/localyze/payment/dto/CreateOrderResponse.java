package com.localyze.payment.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Response details of created razorpay order")
public class CreateOrderResponse {
    
    @Schema(description = "Razorpay order ID")
    private String orderId;
    
    @Schema(description = "Payment currency")
    private String currency;
    
    @Schema(description = "Payment amount in paise")
    private BigDecimal amount;
    
    @Schema(description = "Razorpay Key ID for frontend initialization")
    private String keyId;
    
    @Schema(description = "Internal payment record ID")
    private Long paymentId;
    
    @Schema(description = "Associated booking ID")
    private Long bookingId;
}
