package com.buildguard.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProgressLogResponseDto {

    private Long id;
    private String description;

    private String imageName;
    private Long imageSize;
    private String imageType;
    private String imageUrl;

    private LocalDateTime uploadedAt;
    private LocalDateTime createdAt;

    private LocalDate workDate;
    private String workStatus;

    private Long projectId;
    private Long userId;
    private Long uploadedBy;

    public ProgressLogResponseDto() {
    }

    public ProgressLogResponseDto(Long id,
                                  String description,
                                  String imageName,
                                  Long imageSize,
                                  String imageType,
                                  String imageUrl,
                                  LocalDateTime uploadedAt,
                                  LocalDateTime createdAt,
                                  LocalDate workDate,
                                  String workStatus,
                                  Long projectId,
                                  Long userId,
                                  Long uploadedBy) {

        this.id = id;
        this.description = description;
        this.imageName = imageName;
        this.imageSize = imageSize;
        this.imageType = imageType;
        this.imageUrl = imageUrl;
        this.uploadedAt = uploadedAt;
        this.createdAt = createdAt;
        this.workDate = workDate;
        this.workStatus = workStatus;
        this.projectId = projectId;
        this.userId = userId;
        this.uploadedBy = uploadedBy;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public Long getImageSize() {
        return imageSize;
    }

    public void setImageSize(Long imageSize) {
        this.imageSize = imageSize;
    }

    public String getImageType() {
        return imageType;
    }

    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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