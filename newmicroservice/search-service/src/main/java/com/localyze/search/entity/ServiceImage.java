package com.localyze.search.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "service_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class ServiceImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "service_id")
    private Long serviceId;

    @Column(nullable = false)
    private String imageUrl;

    private String publicId;

    @Column(name = "is_primary")
    private boolean primary;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
