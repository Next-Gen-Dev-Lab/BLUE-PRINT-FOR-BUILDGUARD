package com.buildguard.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "progress_logs")
public class ProgressLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 5000)
    private String description;

    @Column(name = "image_name")
    private String imageName;

    @Column(name = "image_size")
    private Long imageSize;

    @Column(name = "image_type")
    private String imageType;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "work_date")
    private LocalDate workDate;

    @Column(name = "work_status")
    private String workStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    public ProgressLog() {
    }

    public ProgressLog(Long id,
                       String description,
                       String imageName,
                       Long imageSize,
                       String imageType,
                       String imageUrl,
                       LocalDateTime uploadedAt,
                       LocalDateTime createdAt,
                       LocalDate workDate,
                       String workStatus,
                       Project project,
                       User user,
                       User uploadedBy) {

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
        this.project = project;
        this.user = user;
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

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(User uploadedBy) {
        this.uploadedBy = uploadedBy;
    }
}