package com.buildguard.dto;

import java.time.LocalDate;

public class InspectionRequestDto {

    private LocalDate inspectionDate;
    private String status;
    private String remarks;
    private Long inspectorId;
    private Long progressLogId;

    public InspectionRequestDto() {
    }

    public InspectionRequestDto(LocalDate inspectionDate, String status,
            String remarks, Long inspectorId, Long progressLogId) {
        this.inspectionDate = inspectionDate;
        this.status = status;
        this.remarks = remarks;
        this.inspectorId = inspectorId;
        this.progressLogId = progressLogId;
    }

    public LocalDate getInspectionDate() {
        return inspectionDate;
    }

    public void setInspectionDate(LocalDate inspectionDate) {
        this.inspectionDate = inspectionDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public Long getInspectorId() {
        return inspectorId;
    }

    public void setInspectorId(Long inspectorId) {
        this.inspectorId = inspectorId;
    }

    public Long getProgressLogId() {
        return progressLogId;
    }

    public void setProgressLogId(Long progressLogId) {
        this.progressLogId = progressLogId;
    }
}