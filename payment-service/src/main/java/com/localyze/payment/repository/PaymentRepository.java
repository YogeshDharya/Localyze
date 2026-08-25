package com.localyze.payment.repository;

import com.localyze.common.enums.PaymentStatus;
import com.localyze.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    List<Payment> findByUserId(Long userId);
    List<Payment> findByBookingId(Long bookingId);
    Optional<Payment> findByBookingIdAndStatus(Long bookingId, PaymentStatus status);
}
