package com.localyze.notification.config;

import com.localyze.common.event.BookingEvent;
import com.localyze.common.event.PaymentCapturedEvent;
import com.localyze.common.event.UserRegisteredEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerConfig {

    @Value("${spring.kafka.bootstrap-servers:localhost:9092}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.group-id:notification-service-group}")
    private String groupId;

    private Map<String, Object> baseConsumerConfigs() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, ErrorHandlingDeserializer.class);
        props.put(ErrorHandlingDeserializer.VALUE_DESERIALIZER_CLASS, JsonDeserializer.class.getName());
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "com.localyze.common.event");
        props.put(JsonDeserializer.USE_TYPE_INFO_HEADERS, false);
        return props;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, UserRegisteredEvent> userRegisteredKafkaListenerContainerFactory() {
        Map<String, Object> props = baseConsumerConfigs();
        props.put(JsonDeserializer.VALUE_DEFAULT_TYPE, UserRegisteredEvent.class.getName());
        ConsumerFactory<String, UserRegisteredEvent> factory = new DefaultKafkaConsumerFactory<>(props);
        ConcurrentKafkaListenerContainerFactory<String, UserRegisteredEvent> containerFactory = new ConcurrentKafkaListenerContainerFactory<>();
        containerFactory.setConsumerFactory(factory);
        return containerFactory;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, BookingEvent> bookingEventKafkaListenerContainerFactory() {
        Map<String, Object> props = baseConsumerConfigs();
        props.put(JsonDeserializer.VALUE_DEFAULT_TYPE, BookingEvent.class.getName());
        ConsumerFactory<String, BookingEvent> factory = new DefaultKafkaConsumerFactory<>(props);
        ConcurrentKafkaListenerContainerFactory<String, BookingEvent> containerFactory = new ConcurrentKafkaListenerContainerFactory<>();
        containerFactory.setConsumerFactory(factory);
        return containerFactory;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, PaymentCapturedEvent> paymentCapturedKafkaListenerContainerFactory() {
        Map<String, Object> props = baseConsumerConfigs();
        props.put(JsonDeserializer.VALUE_DEFAULT_TYPE, PaymentCapturedEvent.class.getName());
        ConsumerFactory<String, PaymentCapturedEvent> factory = new DefaultKafkaConsumerFactory<>(props);
        ConcurrentKafkaListenerContainerFactory<String, PaymentCapturedEvent> containerFactory = new ConcurrentKafkaListenerContainerFactory<>();
        containerFactory.setConsumerFactory(factory);
        return containerFactory;
    }
}
