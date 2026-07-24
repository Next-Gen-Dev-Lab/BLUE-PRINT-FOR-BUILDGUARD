package com.buildguard.ai;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok(aiService.health());
    }

    @GetMapping("/status")
    public ResponseEntity<String> status() {
        return ResponseEntity.ok(aiService.status());
    }

    @PostMapping("/analyze")
    public ResponseEntity<String> analyze(@RequestBody AiRequest request) {
        return ResponseEntity.ok(aiService.analyze(request));
    }

    @PostMapping("/warning")
    public ResponseEntity<String> warning(@RequestBody WarningRequest request) {
        return ResponseEntity.ok(aiService.warning(request));
    }
}