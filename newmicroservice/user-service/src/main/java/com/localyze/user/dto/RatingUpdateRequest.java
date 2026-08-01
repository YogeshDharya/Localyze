package com.localyze.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingUpdateRequest {
    private Double newAverageRating;
    private Integer newTotalReviews;
}
