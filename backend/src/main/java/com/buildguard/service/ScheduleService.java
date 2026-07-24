package com.buildguard.service;

import java.util.List;

import com.buildguard.dto.ScheduleResponseDto;

public interface ScheduleService {

    ScheduleResponseDto createSchedule(
            String taskName,
            String description,
            String startDate,
            String endDate,
            String status,
            Long projectId);

    List<ScheduleResponseDto> getAllSchedules();

    ScheduleResponseDto getScheduleById(Long id);

    List<ScheduleResponseDto> getSchedulesByProject(Long projectId);

    ScheduleResponseDto updateSchedule(
            Long id,
            String taskName,
            String description,
            String startDate,
            String endDate,
            String status);

    void deleteSchedule(Long id);
}