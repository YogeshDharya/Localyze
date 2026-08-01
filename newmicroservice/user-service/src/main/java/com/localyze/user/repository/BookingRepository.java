package com.localyze.user.repository;

import com.localyze.common.enums.BookingStatus;
import com.localyze.user.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findByCustomerId(Long customerId, Pageable pageable);
    Page<Booking> findByProviderId(Long providerId, Pageable pageable);
    Page<Booking> findByCustomerIdAndStatus(Long customerId, BookingStatus status, Pageable pageable);
    List<Booking> findByServiceId(Long serviceId);
}
