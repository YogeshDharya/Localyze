package com.localyze.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Request to update user profile")
public class UpdateProfileRequest {
    private String name;
    private String phone;
    private String bio;
    private String city;
    private String avatarUrl;
}
