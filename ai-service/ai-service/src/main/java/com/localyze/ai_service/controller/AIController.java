package com.localyze.ai_service.controller;

import com.localyze.ai_service.dto.ChatRequest;
import com.localyze.ai_service.service.AIService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public String chat(@RequestBody ChatRequest request) {

        return aiService.chat(request.getMessage());
    }
}
