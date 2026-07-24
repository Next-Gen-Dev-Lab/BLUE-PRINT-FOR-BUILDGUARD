package com.buildguard.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buildguard.dto.AdminDashboardResponse;
import com.buildguard.dto.EngineerDashboardResponse;
import com.buildguard.dto.ForemanDashboardResponse;
import com.buildguard.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // ===========================
    // ADMIN DASHBOARD
    // ===========================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public AdminDashboardResponse getAdminDashboard() {
        return dashboardService.getAdminDashboard();
    }

    // ===========================
    // PROJECT ENGINEER DASHBOARD
    // ===========================
    @PreAuthorize("hasRole('PROJECT_ENGINEER')")
    @GetMapping("/engineer")
    public EngineerDashboardResponse getEngineerDashboard() {
        return dashboardService.getEngineerDashboard();
    }

    // ===========================
    // FOREMAN DASHBOARD
    // ===========================
    @PreAuthorize("hasRole('FOREMAN')")
    @GetMapping("/foreman")
    public ForemanDashboardResponse getForemanDashboard() {
        return dashboardService.getForemanDashboard();
    }
}