package com.buildguard.service;
import com.buildguard.dto.EngineerDashboardResponse;
import com.buildguard.dto.ForemanDashboardResponse;
import com.buildguard.dto.AdminDashboardResponse;

public interface DashboardService {

    AdminDashboardResponse getAdminDashboard();
    EngineerDashboardResponse getEngineerDashboard();

    ForemanDashboardResponse getForemanDashboard();

}