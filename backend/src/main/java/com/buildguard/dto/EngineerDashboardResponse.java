package com.buildguard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EngineerDashboardResponse {

    private long assignedProjects;
    private long totalProgressLogs;
    private long totalInspections;
    private long totalViolations;
    private long totalSchedules;
    private long totalNotifications;
}