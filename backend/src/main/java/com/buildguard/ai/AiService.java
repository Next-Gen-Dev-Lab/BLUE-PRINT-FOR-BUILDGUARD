package com.buildguard.ai;

public interface AiService {

    String health();

    String status();

    String analyze(AiRequest request);

    String warning(WarningRequest request);

}