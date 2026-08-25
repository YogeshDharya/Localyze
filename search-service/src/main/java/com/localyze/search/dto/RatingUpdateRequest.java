package com.localyze.search.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for updating service rating")
public class RatingUpdateRequest {
    @NotNull
    @Schema(description = "New calculated average rating")
    private Double newAverageRating;

    @NotNull
    @Schema(description = "New total reviews count")
    private Integer newTotalReviews;
}
