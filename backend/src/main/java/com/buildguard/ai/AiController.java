package com.buildguard.ai;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_ENGINEER')")
    @PostMapping("/analyze")
    public AiResponse analyze(@RequestBody AiRequest request) {
        return aiService.analyzeBlueprint(request.getPrompt());
    }
}