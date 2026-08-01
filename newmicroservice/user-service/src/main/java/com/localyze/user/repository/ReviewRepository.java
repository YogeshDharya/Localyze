package com.localyze.user.repository;

import com.localyze.user.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByServiceId(Long serviceId, Pageable pageable);
    Page<Review> findByUserId(Long userId, Pageable pageable);
    boolean existsByServiceIdAndUserId(Long serviceId, Long userId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.serviceId = :serviceId")
    Double getAverageRating(@Param("serviceId") Long serviceId);
    
    Integer countByServiceId(Long serviceId);
}
