package com.buildguard.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class InspectionResponseDto {

    private Long id;
    private LocalDate inspectionDate;
    private String status;
    private String remarks;
    private LocalDateTime createdAt;
    private Long inspectorId;
    private Long progressLogId;

    public InspectionResponseDto() {
    }

    public InspectionResponseDto(Long id, LocalDate inspectionDate,
            String status, String remarks,
            LocalDateTime createdAt,
            Long inspectorId,
            Long progressLogId) {

        this.id = id;
        this.inspectionDate = inspectionDate;
        this.status = status;
        this.remarks = remarks;
        this.createdAt = createdAt;
        this.inspectorId = inspectorId;
        this.progressLogId = progressLogId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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