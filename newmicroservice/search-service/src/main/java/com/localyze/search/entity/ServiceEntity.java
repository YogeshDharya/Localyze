package com.localyze.search.entity;

import com.localyze.common.enums.ServiceStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class ServiceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private String priceUnit;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String city;
    private String address;

    @Builder.Default
    private Double averageRating = 0.0;

    @Builder.Default
    private Integer totalReviews = 0;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ServiceStatus status = ServiceStatus.ACTIVE;

    @Column(nullable = false)
    private Long providerId;

    private String providerName;

    @Column(name = "category_id")
    private Long categoryId;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
