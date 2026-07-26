package com.buildguard.ai;

import org.springframework.stereotype.Service;

@Service
public class AiServiceImpl implements AiService {

    @Override
    public AiResponse analyzeBlueprint(String prompt) {

        return new AiResponse(
                "AI integration pending. Analysis for: " + prompt
        );
    }
}