package com.buildguard.dto;

public class EngineerDashboardResponse {

    private long assignedProjects;
    private long totalProgressLogs;
    private long totalInspections;
    private long totalViolations;
    private long totalSchedules;
    private long totalNotifications;

    public EngineerDashboardResponse() {
    }

    public EngineerDashboardResponse(long assignedProjects,
                                     long totalProgressLogs,
                                     long totalInspections,
                                     long totalViolations,
                                     long totalSchedules,
                                     long totalNotifications) {
        this.assignedProjects = assignedProjects;
        this.totalProgressLogs = totalProgressLogs;
        this.totalInspections = totalInspections;
        this.totalViolations = totalViolations;
        this.totalSchedules = totalSchedules;
        this.totalNotifications = totalNotifications;
    }

    public long getAssignedProjects() {
        return assignedProjects;
    }

    public void setAssignedProjects(long assignedProjects) {
        this.assignedProjects = assignedProjects;
    }

    public long getTotalProgressLogs() {
        return totalProgressLogs;
    }

    public void setTotalProgressLogs(long totalProgressLogs) {
        this.totalProgressLogs = totalProgressLogs;
    }

    public long getTotalInspections() {
        return totalInspections;
    }

    public void setTotalInspections(long totalInspections) {
        this.totalInspections = totalInspections;
    }

    public long getTotalViolations() {
        return totalViolations;
    }

    public void setTotalViolations(long totalViolations) {
        this.totalViolations = totalViolations;
    }

    public long getTotalSchedules() {
        return totalSchedules;
    }

    public void setTotalSchedules(long totalSchedules) {
        this.totalSchedules = totalSchedules;
    }

    public long getTotalNotifications() {
        return totalNotifications;
    }

    public void setTotalNotifications(long totalNotifications) {
        this.totalNotifications = totalNotifications;
    }
}