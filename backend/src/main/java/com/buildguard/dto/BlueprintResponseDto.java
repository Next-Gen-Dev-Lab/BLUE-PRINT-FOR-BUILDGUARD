package com.buildguard.dto;

import java.time.LocalDateTime;

public class BlueprintResponseDto {

    private Long id;
    private String blueprintName;
    private String description;
    private String fileName;
    private Long fileSize;
    private String fileType;
    private String fileUrl;
    private LocalDateTime uploadedAt;
    private Long projectId;

    public BlueprintResponseDto() {
    }

    public BlueprintResponseDto(Long id,
                                String blueprintName,
                                String description,
                                String fileName,
                                Long fileSize,
                                String fileType,
                                String fileUrl,
                                LocalDateTime uploadedAt,
                                Long projectId) {

        this.id = id;
        this.blueprintName = blueprintName;
        this.description = description;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.fileType = fileType;
        this.fileUrl = fileUrl;
        this.uploadedAt = uploadedAt;
        this.projectId = projectId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBlueprintName() {
        return blueprintName;
    }

    public void setBlueprintName(String blueprintName) {
        this.blueprintName = blueprintName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}