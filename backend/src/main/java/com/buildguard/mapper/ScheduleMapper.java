package com.buildguard.mapper;

import org.springframework.stereotype.Component;

import com.buildguard.dto.ScheduleResponseDto;
import com.buildguard.entity.Schedule;

@Component
public class ScheduleMapper {

    public ScheduleResponseDto toDto(Schedule schedule) {

        if (schedule == null) {
            return null;
        }

        ScheduleResponseDto dto = new ScheduleResponseDto();

        dto.setId(schedule.getId());
        dto.setTaskName(schedule.getTaskName());
        dto.setDescription(schedule.getDescription());
        dto.setStartDate(schedule.getStartDate());
        dto.setEndDate(schedule.getEndDate());
        dto.setStatus(schedule.getStatus());
        dto.setCreatedAt(schedule.getCreatedAt());

        if (schedule.getProject() != null) {
            dto.setProjectId(schedule.getProject().getId());
        }

        return dto;
    }

    public Schedule toEntity(ScheduleResponseDto dto) {

        if (dto == null) {
            return null;
        }

        Schedule schedule = new Schedule();

        schedule.setId(dto.getId());
        schedule.setTaskName(dto.getTaskName());
        schedule.setDescription(dto.getDescription());
        schedule.setStartDate(dto.getStartDate());
        schedule.setEndDate(dto.getEndDate());
        schedule.setStatus(dto.getStatus());
        schedule.setCreatedAt(dto.getCreatedAt());

        return schedule;
    }
}