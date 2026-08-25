package com.localyze.payment.config;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "razorpay")
@Data
public class RazorpayConfig {
    private String keyId;
    private String keySecret;

    @Bean
    public RazorpayClient razorpayClient() throws RazorpayException {
        return new RazorpayClient(keyId, keySecret);
    }
}
