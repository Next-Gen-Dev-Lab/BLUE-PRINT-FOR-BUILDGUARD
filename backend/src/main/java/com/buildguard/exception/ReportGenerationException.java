package com.buildguard.exception;

public class ReportGenerationException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ReportGenerationException(String message, Throwable cause) {
        super(message, cause);
    }
}