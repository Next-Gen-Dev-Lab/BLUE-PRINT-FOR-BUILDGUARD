package com.buildguard.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "inspections")
public class Inspection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "inspection_date")
    private LocalDate inspectionDate;

    private String status;

    @Column(length = 5000)
    private String remarks;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inspector_id")
    private User inspector;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "progress_log_id")
    private ProgressLog progressLog;

    public Inspection() {
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

    public User getInspector() {
        return inspector;
    }

    public void setInspector(User inspector) {
        this.inspector = inspector;
    }

    public ProgressLog getProgressLog() {
        return progressLog;
    }

    public void setProgressLog(ProgressLog progressLog) {
        this.progressLog = progressLog;
    }
}