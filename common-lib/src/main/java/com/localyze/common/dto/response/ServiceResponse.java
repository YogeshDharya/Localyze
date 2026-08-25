package com.localyze.common.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ServiceResponse {
    private Long id;
    private Long providerId;
    private String providerName;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String description;
    private BigDecimal price;
    private String priceUnit;
    private Double latitude;
    private Double longitude;
    private String city; 
    private String address;
    private Double averageRating;
    private Integer totalReviews;
    private String status;
    private List<String> imageUrls;
    private Double distanceKm;
    private LocalDateTime createdAt;
}
