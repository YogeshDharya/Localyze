package com.localyze.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request object for resetting password")
public class ResetPasswordRequest {
    @NotBlank
    @Schema(description = "Password reset token")
    private String token;

    @NotBlank
    @Size(min = 6)
    @Schema(description = "New password")
    private String newPassword;
}
