package com.localyze.user.dto;

import com.localyze.common.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Request to create user profile")
public class CreateUserProfileRequest {
    private Long id;
    private String email;
    private String name;
    private String phone;
    private String city;
    private Role role;
}
