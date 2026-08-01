package com.localyze.auth.kafka;

import com.localyze.common.event.UserRegisteredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

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
