package com.localyze.mapper;

import com.localyze.dto.response.UserResponse;
import com.localyze.entity.User;
import org.springframework.stereotype.Component;


@Component
public class UserMapper {


    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .profileImageUrl(user.getProfileImageUrl())
                .address(user.getAddress())
                .latitude(user.getLatitude())
                .longitude(user.getLongitude())
                .isVerified(user.isVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
