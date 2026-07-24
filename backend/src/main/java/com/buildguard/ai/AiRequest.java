package com.buildguard.ai;

public class AiRequest {

    private String report;
    private String pdfPath;

    public AiRequest() {
        // Default constructor
    }

    public AiRequest(String report, String pdfPath) {
        this.report = report;
        this.pdfPath = pdfPath;
    }

    public String getReport() {
        return report;
    }

    public void setReport(String report) {
        this.report = report;
    }

    public String getPdfPath() {
        return pdfPath;
    }

    public void setPdfPath(String pdfPath) {
        this.pdfPath = pdfPath;
    }
}