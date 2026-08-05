package com.localyze.mapper;

import com.localyze.dto.response.ReviewResponse;
import com.localyze.entity.Review;
import org.springframework.stereotype.Component;

/**
 * Maps Review entity to ReviewResponse DTO.
 */
@Component
public class ReviewMapper {

    /**
     * Converts a Review entity to a ReviewResponse DTO.
     *
     * @param review the review entity
     * @return the review response DTO
     */
    public ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getFullName())
                .userProfileImage(review.getUser().getProfileImageUrl())
                .serviceId(review.getService().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
