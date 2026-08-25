package com.localyze.search.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for category operations")
public class CategoryRequest {
    @NotBlank
    @Schema(description = "Name of the category")
    private String name;

    @Schema(description = "Description of the category")
    private String description;

    @Schema(description = "URL for the category icon")
    private String iconUrl;
}
