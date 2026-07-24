package com.buildguard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalProjects;
    private long totalUsers;
    private long totalBlueprints;
    private long totalProgressLogs;
    private long totalInspections;
    private long totalViolations;
    private long totalSchedules;
    private long totalNotifications;
}