package com.localyze.mapper;

import com.localyze.dto.response.ReviewResponse;
import com.localyze.entity.Review;
import org.springframework.stereotype.Component;


@Component
public class ReviewMapper {


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
