package com.localyze.repository;

import com.localyze.entity.Booking;
import com.localyze.entity.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByUserId(Long userId, Pageable pageable);

    Page<Booking> findBySellerId(Long sellerId, Pageable pageable);

    Page<Booking> findBySellerIdAndStatus(Long sellerId, BookingStatus status, Pageable pageable);

    Page<Booking> findByUserIdAndStatus(Long userId, BookingStatus status, Pageable pageable);

    boolean existsByUserIdAndServiceIdAndStatusNot(Long userId, Long serviceId, BookingStatus status);
}
