package com.localyze.notification.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request object for sending emails")
public class EmailRequest {
    @NotBlank
    @Schema(description = "Recipient email address")
    private String to;
    
    @NotBlank
    @Schema(description = "Subject of the email")
    private String subject;
    
    @NotBlank
    @Schema(description = "Type of email (e.g. PASSWORD_RESET, GENERIC)")
    private String type;
    
    @Schema(description = "Data required for templating")
    private Map<String, Object> data;
    
    @Schema(description = "Direct HTML body if type is GENERIC")
    private String htmlBody;
}
