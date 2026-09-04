package com.localyze.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ServiceResponse {

    private Long id;
    private Long sellerId;
    private String sellerName;
    private String sellerPhone;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String description;
    private BigDecimal price;
    private String priceUnit;
    private String address;
    private Double latitude;
    private Double longitude;
    private String availability;
    private String status;
    private Double avgRating;
    private int totalReviews;
    private List<String> imageUrls;
    private Double distance;
    private LocalDateTime createdAt;
}
