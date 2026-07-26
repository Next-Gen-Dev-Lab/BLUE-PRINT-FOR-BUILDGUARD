package com.buildguard.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "blueprints")
public class Blueprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String blueprintName;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private Long fileSize;

    @Column(nullable = false)
    private String fileType;

    @Column(nullable = false, length = 1000)
    private String fileUrl;

    private LocalDateTime uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    public Blueprint() {
    }

    public Blueprint(Long id, String blueprintName, String description,
                     String fileName, Long fileSize, String fileType,
                     String fileUrl, LocalDateTime uploadedAt, Project project) {
        this.id = id;
        this.blueprintName = blueprintName;
        this.description = description;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.fileType = fileType;
        this.fileUrl = fileUrl;
        this.uploadedAt = uploadedAt;
        this.project = project;
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

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}