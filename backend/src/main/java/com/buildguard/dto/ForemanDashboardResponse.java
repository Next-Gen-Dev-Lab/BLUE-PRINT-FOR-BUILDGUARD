package com.buildguard.dto;

public class ForemanDashboardResponse {

    private long assignedProjects;
    private long totalProgressLogs;
    private long totalSchedules;
    private long totalNotifications;

    public ForemanDashboardResponse() {
    }

    public ForemanDashboardResponse(long assignedProjects,
                                    long totalProgressLogs,
                                    long totalSchedules,
                                    long totalNotifications) {
        this.assignedProjects = assignedProjects;
        this.totalProgressLogs = totalProgressLogs;
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