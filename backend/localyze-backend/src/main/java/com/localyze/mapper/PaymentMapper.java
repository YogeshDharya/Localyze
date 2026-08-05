package com.localyze.mapper;

import com.localyze.dto.response.PaymentResponse;
import com.localyze.entity.Payment;
import org.springframework.stereotype.Component;

/**
 * Maps Payment entity to PaymentResponse DTO.
 */
@Component
public class PaymentMapper {

    /**
     * Converts a Payment entity to a PaymentResponse DTO.
     *
     * @param payment the payment entity
     * @return the payment response DTO
     */
    public PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking().getId())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus().name())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
