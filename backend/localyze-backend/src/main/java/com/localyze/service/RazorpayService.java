package com.localyze.service;

import com.localyze.dto.request.PaymentVerificationRequest;
import com.localyze.dto.response.PaymentResponse;
import com.localyze.entity.Booking;
import com.localyze.entity.Payment;
import com.localyze.entity.User;
import com.localyze.entity.enums.BookingStatus;
import com.localyze.entity.enums.PaymentStatus;
import com.localyze.exception.BadRequestException;
import com.localyze.exception.ResourceNotFoundException;
import com.localyze.mapper.PaymentMapper;
import com.localyze.repository.BookingRepository;
import com.localyze.repository.PaymentRepository;
import com.localyze.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Integrates with Razorpay for payment processing.
 * Handles order creation, signature verification, and payment status tracking.
 */
@Service
@RequiredArgsConstructor
public class RazorpayService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final PaymentMapper paymentMapper;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    /**
     * Creates a Razorpay order for the given booking and persists the payment record.
     * Amount is derived from the booking's associated service price.
     *
     * @param bookingId the booking ID to create payment for
     * @param userEmail the authenticated user's email
     * @return the created payment response with Razorpay order ID
     * @throws BadRequestException       if a payment already exists for this booking
     * @throws ResourceNotFoundException if the booking or user does not exist
     */
    @Transactional
    public PaymentResponse createOrder(Long bookingId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        // Check if payment already exists
        if (paymentRepository.findByBookingId(bookingId).isPresent()) {
            throw new BadRequestException("Payment already exists for this booking");
        }

        BigDecimal amount = booking.getService().getPrice();

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            // Razorpay expects amount in paise (smallest currency unit)
            orderRequest.put("amount", amount.multiply(BigDecimal.valueOf(100)).intValue());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "booking_" + bookingId);

            Order razorpayOrder = client.orders.create(orderRequest);

            Payment payment = Payment.builder()
                    .booking(booking)
                    .user(user)
                    .razorpayOrderId(razorpayOrder.get("id"))
                    .amount(amount)
                    .currency("INR")
                    .status(PaymentStatus.CREATED)
                    .build();

            return paymentMapper.toResponse(paymentRepository.save(payment));

        } catch (RazorpayException e) {
            throw new BadRequestException("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    /**
     * Verifies a Razorpay payment using HMAC-SHA256 signature verification.
     * On success, updates the payment status to PAID and advances the booking to CONFIRMED.
     *
     * @param request the payment verification request containing orderId, paymentId, and signature
     * @return the updated payment response
     * @throws BadRequestException if the payment is not found or signature verification fails
     */
    @Transactional
    public PaymentResponse verifyPayment(PaymentVerificationRequest request) {
        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "razorpayOrderId", request.getRazorpayOrderId()));

        // Verify signature
        String generatedSignature = generateSignature(
                request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId(),
                razorpayKeySecret
        );

        if (generatedSignature.equals(request.getRazorpaySignature())) {
            payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
            payment.setRazorpaySignature(request.getRazorpaySignature());
            payment.setStatus(PaymentStatus.PAID);

            // Update booking status to CONFIRMED on successful payment
            Booking booking = payment.getBooking();
            if (booking.getStatus() == BookingStatus.PENDING) {
                booking.setStatus(BookingStatus.CONFIRMED);
                bookingRepository.save(booking);
            }
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new BadRequestException("Payment verification failed: invalid signature");
        }

        return paymentMapper.toResponse(paymentRepository.save(payment));
    }

    /**
     * Retrieves the payment details for a specific booking.
     *
     * @param bookingId the booking ID
     * @return the payment response
     * @throws ResourceNotFoundException if no payment exists for the booking
     */
    public PaymentResponse getPaymentByBookingId(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "bookingId", bookingId));
        return paymentMapper.toResponse(payment);
    }

    /**
     * Retrieves all payments for the authenticated user.
     *
     * @param userEmail the user's email
     * @return list of payment responses
     */
    public List<PaymentResponse> getUserPayments(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));
        return paymentRepository.findByUserId(user.getId()).stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Generates an HMAC-SHA256 signature for Razorpay payment verification.
     *
     * @param data the data to sign (orderId|paymentId)
     * @param key  the Razorpay key secret
     * @return the hex-encoded HMAC signature
     */
    private String generateSignature(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new BadRequestException("Error generating payment signature");
        }
    }
}
