package com.localyze.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request object for forgot password")
public class ForgotPasswordRequest {
    @NotBlank
    @Email
    @Schema(description = "User's email address")
    private String email;
}
