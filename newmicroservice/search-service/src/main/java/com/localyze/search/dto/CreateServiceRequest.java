package com.localyze.search.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for creating a new service")
public class CreateServiceRequest {
    @NotBlank
    @Schema(description = "Title of the service")
    private String title;

    @Schema(description = "Detailed description")
    private String description;

    @NotNull
    @DecimalMin("0.0")
    @Schema(description = "Price for the service")
    private BigDecimal price;

    @Schema(description = "Pricing unit (e.g., hour, job)")
    private String priceUnit;

    @NotNull
    @Schema(description = "Latitude of service location")
    private Double latitude;

    @NotNull
    @Schema(description = "Longitude of service location")
    private Double longitude;

    @Schema(description = "City of the service")
    private String city;

    @Schema(description = "Full address of the service")
    private String address;

    @NotNull
    @Schema(description = "ID of the category")
    private Long categoryId;
}
