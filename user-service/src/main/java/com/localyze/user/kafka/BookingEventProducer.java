package com.localyze.user.kafka;

import com.localyze.common.event.BookingEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingEventProducer {
    private final KafkaTemplate<String, BookingEvent> kafkaTemplate;
    
    private static final String TOPIC_CONFIRMED = "localyze.booking.confirmed";
    private static final String TOPIC_CANCELLED = "localyze.booking.cancelled";

    public void publishBookingEvent(BookingEvent event) {
        String topic;
        switch (event.getEventType()) {
            case "CONFIRMED":
                topic = TOPIC_CONFIRMED;
                break;
            case "CANCELLED":
                topic = TOPIC_CANCELLED;
                break;
            default:
                log.warn("Unknown booking event type: {}", event.getEventType());
                return;
        }
        log.info("Publishing BookingEvent to topic {}: {}", topic, event);
        kafkaTemplate.send(topic, String.valueOf(event.getBookingId()), event);
    }
}
