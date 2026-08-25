package com.localyze.ai_service.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final ChatClient chatClient;

    public AIService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String chat(String message) {

        return chatClient
                .prompt()
                .user(message)
                .call()
                .content();
    }
}
