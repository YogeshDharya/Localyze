package com.localyze.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookingResponse {

    private Long id;
    private Long userId;
    private String userName;
    private Long serviceId;
    private String serviceTitle;
    private Long sellerId;
    private String sellerName;
    private String status;
    private LocalDate bookingDate;
    private String timeSlot;
    private String notes;
    private String cancellationReason;
    private PaymentResponse payment;
    private LocalDateTime createdAt;
}
