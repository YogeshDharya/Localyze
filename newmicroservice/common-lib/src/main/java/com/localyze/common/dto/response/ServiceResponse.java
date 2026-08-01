package com.localyze.common.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ServiceResponse {
    private Long id;
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
    private Long providerId;
    private String providerName;
    private Long categoryId;
    private String categoryName;
    private List<String> imageUrls;
    private LocalDateTime createdAt;
    private Double distanceKm;
}
