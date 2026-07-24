package com.buildguard.service.impl;

import org.springframework.stereotype.Service;

import com.buildguard.dto.AdminDashboardResponse;
import com.buildguard.dto.EngineerDashboardResponse;
import com.buildguard.dto.ForemanDashboardResponse;
import com.buildguard.repository.BlueprintRepository;
import com.buildguard.repository.InspectionRepository;
import com.buildguard.repository.NotificationRepository;
import com.buildguard.repository.ProgressLogRepository;
import com.buildguard.repository.ProjectRepository;
import com.buildguard.repository.SafetyViolationRepository;
import com.buildguard.repository.ScheduleRepository;
import com.buildguard.repository.UserRepository;
import com.buildguard.service.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final BlueprintRepository blueprintRepository;
    private final ProgressLogRepository progressLogRepository;
    private final InspectionRepository inspectionRepository;
    private final SafetyViolationRepository safetyViolationRepository;
    private final ScheduleRepository scheduleRepository;
    private final NotificationRepository notificationRepository;

    public DashboardServiceImpl(
            ProjectRepository projectRepository,
            UserRepository userRepository,
            BlueprintRepository blueprintRepository,
            ProgressLogRepository progressLogRepository,
            InspectionRepository inspectionRepository,
            SafetyViolationRepository safetyViolationRepository,
            ScheduleRepository scheduleRepository,
            NotificationRepository notificationRepository) {

        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.blueprintRepository = blueprintRepository;
        this.progressLogRepository = progressLogRepository;
        this.inspectionRepository = inspectionRepository;
        this.safetyViolationRepository = safetyViolationRepository;
        this.scheduleRepository = scheduleRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public AdminDashboardResponse getAdminDashboard() {

        return new AdminDashboardResponse(
                projectRepository.count(),
                userRepository.count(),
                blueprintRepository.count(),
                progressLogRepository.count(),
                inspectionRepository.count(),
                safetyViolationRepository.count(),
                scheduleRepository.count(),
                notificationRepository.count()
        );
    }

    @Override
    public EngineerDashboardResponse getEngineerDashboard() {

        return new EngineerDashboardResponse(
                projectRepository.count(),
                progressLogRepository.count(),
                inspectionRepository.count(),
                safetyViolationRepository.count(),
                scheduleRepository.count(),
                notificationRepository.count()
        );
    }

    @Override
    public ForemanDashboardResponse getForemanDashboard() {

        return new ForemanDashboardResponse(
                projectRepository.count(),
                progressLogRepository.count(),
                scheduleRepository.count(),
                notificationRepository.count()
        );
    }

}