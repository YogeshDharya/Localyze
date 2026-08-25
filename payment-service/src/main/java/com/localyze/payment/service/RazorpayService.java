package com.localyze.payment.service;

import com.localyze.common.dto.request.PaymentVerificationRequest;
import com.localyze.common.dto.response.PaymentResponse;
import com.localyze.common.enums.PaymentStatus;
import com.localyze.common.event.PaymentCapturedEvent;
import com.localyze.common.exception.BadRequestException;
import com.localyze.common.exception.ResourceNotFoundException;
import com.localyze.payment.client.BookingStatusClient;
import com.localyze.payment.config.RazorpayConfig;
import com.localyze.payment.dto.CreateOrderRequest;
import com.localyze.payment.dto.CreateOrderResponse;
import com.localyze.payment.entity.Payment;
import com.localyze.payment.kafka.PaymentCapturedEventProducer;
import com.localyze.payment.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RazorpayService {

    private final RazorpayClient razorpayClient;
    private final RazorpayConfig razorpayConfig;
    private final PaymentRepository paymentRepository;
    private final BookingStatusClient bookingStatusClient;
    private final PaymentCapturedEventProducer paymentCapturedEventProducer;

    @Transactional
    public CreateOrderResponse createOrder(Long userId, CreateOrderRequest request) {
        log.info("Creating Razorpay order for user: {}, booking: {}, amount: {}", userId, request.getBookingId(), request.getAmount());
        
        try {
            BigDecimal amountInPaise = request.getAmount().multiply(new BigDecimal("100"));
            
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise.intValue());
            orderRequest.put("currency", request.getCurrency());
            if (request.getReceipt() != null) {
                orderRequest.put("receipt", request.getReceipt());
            }

            Order order = razorpayClient.orders.create(orderRequest);
            String razorpayOrderId = order.get("id");

            Payment payment = Payment.builder()
                    .bookingId(request.getBookingId())
                    .userId(userId)
                    .razorpayOrderId(razorpayOrderId)
                    .amount(request.getAmount())
                    .currency(request.getCurrency())
                    .status(PaymentStatus.PENDING)
                    .build();

            payment = paymentRepository.save(payment);

            return CreateOrderResponse.builder()
                    .orderId(razorpayOrderId)
                    .currency(request.getCurrency())
                    .amount(amountInPaise)
                    .keyId(razorpayConfig.getKeyId())
                    .paymentId(payment.getId())
                    .bookingId(request.getBookingId())
                    .build();
        } catch (RazorpayException e) {
            log.error("Error creating Razorpay order: ", e);
            throw new RuntimeException("Failed to create Razorpay order", e);
        }
    }

    @Transactional
    public PaymentResponse verifyAndCapturePayment(Long userId, String userName, String userEmail, PaymentVerificationRequest request) {
        log.info("Verifying payment signature for order: {}", request.getRazorpayOrderId());
        
        try {
            String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(razorpayConfig.getKeySecret().getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hashBytes = mac.doFinal(payload.getBytes());
            String expectedSignature = bytesToHex(hashBytes);

            if (!expectedSignature.equals(request.getRazorpaySignature())) {
                throw new BadRequestException("Invalid payment signature");
            }

            Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order id: " + request.getRazorpayOrderId()));

            if (payment.getStatus() == PaymentStatus.CAPTURED) {
                return mapToResponse(payment);
            }

            payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
            payment.setStatus(PaymentStatus.CAPTURED);
            payment = paymentRepository.save(payment);

            bookingStatusClient.markBookingAsPaid(request.getBookingId());

            PaymentCapturedEvent event = PaymentCapturedEvent.builder()
                    .bookingId(request.getBookingId())
                    .paymentId(payment.getId())
                    .userId(userId)
                    .amount(payment.getAmount())
                    .currency(payment.getCurrency())
                    .razorpayPaymentId(request.getRazorpayPaymentId())
                    .build();
            paymentCapturedEventProducer.sendPaymentCapturedEvent(event);

            return mapToResponse(payment);
        } catch (Exception e) {
            log.error("Error verifying payment: ", e);
            if (e instanceof BadRequestException || e instanceof ResourceNotFoundException) {
                throw (RuntimeException) e;
            }
            throw new RuntimeException("Failed to verify payment", e);
        }
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByUser(Long userId) {
        return paymentRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByBooking(Long bookingId) {
        List<Payment> payments = paymentRepository.findByBookingId(bookingId);
        if (payments.isEmpty()) {
            throw new ResourceNotFoundException("No payment found for booking id: " + bookingId);
        }
        return mapToResponse(payments.get(payments.size() - 1));
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(payment.getBookingId())
                .userId(payment.getUserId())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus().name())
                .createdAt(payment.getCreatedAt())
                .build();
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
