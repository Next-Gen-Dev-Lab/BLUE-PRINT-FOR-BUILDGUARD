package com.buildguard.dto;

import java.time.LocalDate;

public class ProgressLogRequestDto {

    private String description;
    private LocalDate workDate;
    private String workStatus;
    private Long projectId;
    private Long userId;
    private Long uploadedBy;

    public ProgressLogRequestDto() {
    }

    public ProgressLogRequestDto(String description,
                                 LocalDate workDate,
                                 String workStatus,
                                 Long projectId,
                                 Long userId,
                                 Long uploadedBy) {

        this.description = description;
        this.workDate = workDate;
        this.workStatus = workStatus;
        this.projectId = projectId;
        this.userId = userId;
        this.uploadedBy = uploadedBy;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getWorkDate() {
        return workDate;
    }

    public void setWorkDate(LocalDate workDate) {
        this.workDate = workDate;
    }

    public String getWorkStatus() {
        return workStatus;
    }

    public void setWorkStatus(String workStatus) {
        this.workStatus = workStatus;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(Long uploadedBy) {
        this.uploadedBy = uploadedBy;
    }
}