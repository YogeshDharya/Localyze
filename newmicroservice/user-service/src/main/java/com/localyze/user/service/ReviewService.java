package com.localyze.user.service;

import com.localyze.common.dto.request.ReviewRequest;
import com.localyze.common.dto.response.PagedResponse;
import com.localyze.common.dto.response.ReviewResponse;
import com.localyze.common.enums.Role;
import com.localyze.common.exception.DuplicateResourceException;
import com.localyze.common.exception.ResourceNotFoundException;
import com.localyze.common.exception.UnauthorizedException;
import com.localyze.user.client.SearchServiceClient;
import com.localyze.user.dto.RatingUpdateRequest;
import com.localyze.user.entity.Review;
import com.localyze.user.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final SearchServiceClient searchServiceClient;

    @Transactional
    public ReviewResponse createReview(Long userId, String userName, ReviewRequest request) {
        if (reviewRepository.existsByServiceIdAndUserId(request.getServiceId(), userId)) {
            throw new DuplicateResourceException("You have already reviewed this service");
        }
        
        Review review = Review.builder()
                .serviceId(request.getServiceId())
                .userId(userId)
                .userName(userName)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
                
        reviewRepository.save(review);
        
        // Compute and update search-service
        Double avgRating = reviewRepository.getAverageRating(request.getServiceId());
        Integer totalReviews = reviewRepository.countByServiceId(request.getServiceId());
        
        try {
            searchServiceClient.updateServiceRating(request.getServiceId(), new RatingUpdateRequest(avgRating, totalReviews));
        } catch (Exception e) {
            log.error("Failed to update rating in search-service for service {}", request.getServiceId(), e);
        }
        
        return mapToResponse(review);
    }

    public PagedResponse<ReviewResponse> getReviewsByService(Long serviceId, int page, int size) {
        Page<Review> reviewPage = reviewRepository.findByServiceId(serviceId, PageRequest.of(page, size));
        return buildPagedResponse(reviewPage);
    }

    public PagedResponse<ReviewResponse> getReviewsByUser(Long userId, int page, int size) {
        Page<Review> reviewPage = reviewRepository.findByUserId(userId, PageRequest.of(page, size));
        return buildPagedResponse(reviewPage);
    }

    @Transactional
    public void deleteReview(Long reviewId, Long requesterId, String requesterRole) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
                
        if (!review.getUserId().equals(requesterId) && !Role.ADMIN.name().equals(requesterRole)) {
            throw new UnauthorizedException("Not authorized to delete this review");
        }
        
        Long serviceId = review.getServiceId();
        reviewRepository.delete(review);
        
        Double avgRating = reviewRepository.getAverageRating(serviceId);
        Integer totalReviews = reviewRepository.countByServiceId(serviceId);
        if (avgRating == null) avgRating = 0.0;
        if (totalReviews == null) totalReviews = 0;
        
        try {
            searchServiceClient.updateServiceRating(serviceId, new RatingUpdateRequest(avgRating, totalReviews));
        } catch (Exception e) {
            log.error("Failed to update rating in search-service after review deletion", e);
        }
    }
    
    private PagedResponse<ReviewResponse> buildPagedResponse(Page<Review> page) {
        List<ReviewResponse> content = page.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return new PagedResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
    
    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .serviceId(review.getServiceId())
                .userId(review.getUserId())
                .userName(review.getUserName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
