package com.buildguard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ForemanDashboardResponse {

    private long assignedProjects;
    private long totalProgressLogs;
    private long totalSchedules;
    private long totalNotifications;
}