package com.localyze.payment.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to create a razorpay order")
public class CreateOrderRequest {

    @NotNull(message = "Booking ID is required")
    @Schema(description = "ID of the booking to be paid")
    private Long bookingId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    @Schema(description = "Payment amount in the specified currency")
    private BigDecimal amount;

    @Schema(description = "Currency of the payment", defaultValue = "INR")
    private String currency = "INR";

    @Schema(description = "Optional receipt ID")
    private String receipt;
}
