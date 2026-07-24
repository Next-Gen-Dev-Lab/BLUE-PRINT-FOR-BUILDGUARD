package com.buildguard.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.buildguard.dto.ScheduleResponseDto;
import com.buildguard.service.ScheduleService;

@RestController
@RequestMapping("/api/schedules")

public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @PostMapping
    public ScheduleResponseDto createSchedule(
            @RequestParam String taskName,
            @RequestParam String description,
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam String status,
            @RequestParam Long projectId) {

        return scheduleService.createSchedule(
                taskName,
                description,
                startDate,
                endDate,
                status,
                projectId);
    }

    @GetMapping
    public List<ScheduleResponseDto> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    @GetMapping("/{id}")
    public ScheduleResponseDto getScheduleById(@PathVariable Long id) {
        return scheduleService.getScheduleById(id);
    }

    @GetMapping("/project/{projectId}")
    public List<ScheduleResponseDto> getSchedulesByProject(
            @PathVariable Long projectId) {

        return scheduleService.getSchedulesByProject(projectId);
    }

    @PutMapping("/{id}")
    public ScheduleResponseDto updateSchedule(
            @PathVariable Long id,
            @RequestParam String taskName,
            @RequestParam String description,
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam String status) {

        return scheduleService.updateSchedule(
                id,
                taskName,
                description,
                startDate,
                endDate,
                status);
    }

    @DeleteMapping("/{id}")
    public String deleteSchedule(@PathVariable Long id) {

        scheduleService.deleteSchedule(id);

        return "Schedule deleted successfully.";
    }
}