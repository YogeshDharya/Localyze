package com.localyze.mapper;

import com.localyze.dto.response.BookingResponse;
import com.localyze.entity.Booking;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class BookingMapper {

    private final PaymentMapper paymentMapper;


    public BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getFullName())
                .serviceId(booking.getService().getId())
                .serviceTitle(booking.getService().getTitle())
                .sellerId(booking.getSeller().getId())
                .sellerName(booking.getSeller().getFullName())
                .status(booking.getStatus().name())
                .bookingDate(booking.getBookingDate())
                .timeSlot(booking.getTimeSlot())
                .notes(booking.getNotes())
                .cancellationReason(booking.getCancellationReason())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
