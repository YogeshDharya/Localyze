package com.localyze.payment.kafka;

import com.localyze.common.event.PaymentCapturedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentCapturedEventProducer {
    
    private final KafkaTemplate<String, PaymentCapturedEvent> kafkaTemplate;
    private static final String TOPIC = "localyze.payment.captured";

    public void sendPaymentCapturedEvent(PaymentCapturedEvent event) {
        log.info("Publishing PaymentCapturedEvent to Kafka for booking: {}", event.getBookingId());
        kafkaTemplate.send(TOPIC, String.valueOf(event.getBookingId()), event)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("PaymentCapturedEvent sent successfully for booking: {}", event.getBookingId());
                    } else {
                        log.error("Error sending PaymentCapturedEvent for booking: {}", event.getBookingId(), ex);
                    }
                });
    }
}
