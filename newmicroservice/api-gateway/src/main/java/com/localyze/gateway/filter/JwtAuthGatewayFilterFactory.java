package com.localyze.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;

/**
 * A dummy filter factory to satisfy the YAML configuration that declares:
 * - name: JwtAuthGatewayFilter
 * Since the actual JWT filtering is handled by the GlobalFilter, this factory
 * simply returns a no-op GatewayFilter to prevent application startup errors.
 */
@Component
public class JwtAuthGatewayFilterFactory extends AbstractGatewayFilterFactory<JwtAuthGatewayFilterFactory.Config> {

    public JwtAuthGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> chain.filter(exchange);
    }

    public static class Config {
        private boolean skip;
        
        public boolean isSkip() { return skip; }
        public void setSkip(boolean skip) { this.skip = skip; }
    }
}
