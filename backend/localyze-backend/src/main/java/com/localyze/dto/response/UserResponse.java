package com.localyze.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String profileImageUrl;
    private String address;
    private Double latitude;
    private Double longitude;
    private boolean isVerified;
    private LocalDateTime createdAt;
}
