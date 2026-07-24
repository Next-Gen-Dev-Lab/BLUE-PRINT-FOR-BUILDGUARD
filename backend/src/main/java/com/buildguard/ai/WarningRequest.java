package com.buildguard.ai;

public class WarningRequest {

    private Object analysis;

    public WarningRequest() {
    }

    public WarningRequest(Object analysis) {
        this.analysis = analysis;
    }

    public Object getAnalysis() {
        return analysis;
    }

    public void setAnalysis(Object analysis) {
        this.analysis = analysis;
    }
}