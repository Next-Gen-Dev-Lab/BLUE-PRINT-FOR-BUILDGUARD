package com.buildguard.dto;

public class AdminDashboardResponse {

    private long totalProjects;
    private long totalUsers;
    private long totalBlueprints;
    private long totalProgressLogs;
    private long totalInspections;
    private long totalViolations;
    private long totalSchedules;
    private long totalNotifications;

    public AdminDashboardResponse() {
    }

    public AdminDashboardResponse(long totalProjects,
                                  long totalUsers,
                                  long totalBlueprints,
                                  long totalProgressLogs,
                                  long totalInspections,
                                  long totalViolations,
                                  long totalSchedules,
                                  long totalNotifications) {

        this.totalProjects = totalProjects;
        this.totalUsers = totalUsers;
        this.totalBlueprints = totalBlueprints;
        this.totalProgressLogs = totalProgressLogs;
        this.totalInspections = totalInspections;
        this.totalViolations = totalViolations;
        this.totalSchedules = totalSchedules;
        this.totalNotifications = totalNotifications;
    }

	public long getTotalProjects() {
		return totalProjects;
	}

	public void setTotalProjects(long totalProjects) {
		this.totalProjects = totalProjects;
	}

	public long getTotalUsers() {
		return totalUsers;
	}

	public void setTotalUsers(long totalUsers) {
		this.totalUsers = totalUsers;
	}

	public long getTotalBlueprints() {
		return totalBlueprints;
	}

	public void setTotalBlueprints(long totalBlueprints) {
		this.totalBlueprints = totalBlueprints;
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

    // Generate getters and setters
    
}