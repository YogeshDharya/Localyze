package com.localyze.repository;

import com.localyze.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByServiceIdAndIsDeletedFalse(Long serviceId, Pageable pageable);

    boolean existsByBookingId(Long bookingId);

    Optional<Review> findByBookingId(Long bookingId);
}
