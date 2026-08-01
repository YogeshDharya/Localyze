package com.localyze.user.dto;

import com.localyze.common.enums.BookingStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Request to change booking status")
public class ChangeBookingStatusRequest {
    private BookingStatus status;
}
