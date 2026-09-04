package com.localyze.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.localyze.events.UserRegisteredEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserRegisteredEventProducer {
    private final KafkaTemplate<String, UserRegisteredEvent> kafkaTemplate;
    private static final String TOPIC = "localyze.user.registered";
    
    public void publish(UserRegisteredEvent event) {
        kafkaTemplate.send(TOPIC, String.valueOf(event.getUserId()), event)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to publish UserRegisteredEvent", ex);
                } else {
                    log.info("Published UserRegisteredEvent for user: {}", event.getEmail());
                }
            });
    }
}
