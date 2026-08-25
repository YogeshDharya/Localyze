package com.localyze.search.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for updating an existing service")
public class UpdateServiceRequest {
    @Schema(description = "Title of the service")
    private String title;

    @Schema(description = "Detailed description")
    private String description;

    @Schema(description = "Price for the service")
    private BigDecimal price;

    @Schema(description = "Pricing unit")
    private String priceUnit;

    @Schema(description = "Latitude of service location")
    private Double latitude;

    @Schema(description = "Longitude of service location")
    private Double longitude;

    @Schema(description = "City of the service")
    private String city;

    @Schema(description = "Full address of the service")
    private String address;

    @Schema(description = "ID of the category")
    private Long categoryId;
}
