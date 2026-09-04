package com.localyze.mapper;

import com.localyze.dto.response.ServiceResponse;
import com.localyze.entity.ServiceEntity;
import com.localyze.entity.ServiceImage;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Component
public class ServiceMapper {


    public ServiceResponse toResponse(ServiceEntity service) {
        return toResponse(service, null);
    }

    public ServiceResponse toResponse(ServiceEntity service, Double distance) {
        List<String> imageUrls = service.getImages() != null
                ? service.getImages().stream()
                    .map(ServiceImage::getImageUrl)
                    .collect(Collectors.toList())
                : Collections.emptyList();

        return ServiceResponse.builder()
                .id(service.getId())
                .sellerId(service.getSeller().getId())
                .sellerName(service.getSeller().getFullName())
                .sellerPhone(service.getSeller().getPhone())
                .categoryId(service.getCategory().getId())
                .categoryName(service.getCategory().getName())
                .title(service.getTitle())
                .description(service.getDescription())
                .price(service.getPrice())
                .priceUnit(service.getPriceUnit())
                .address(service.getAddress())
                .latitude(service.getLatitude())
                .longitude(service.getLongitude())
                .availability(service.getAvailability())
                .status(service.getStatus().name())
                .avgRating(service.getAvgRating())
                .totalReviews(service.getTotalReviews())
                .imageUrls(imageUrls)
                .distance(distance)
                .createdAt(service.getCreatedAt())
                .build();
    }
}
