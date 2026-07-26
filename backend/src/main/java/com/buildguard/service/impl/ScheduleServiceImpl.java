package com.buildguard.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.buildguard.dto.ScheduleResponseDto;
import com.buildguard.entity.Project;
import com.buildguard.entity.Schedule;
import com.buildguard.mapper.ScheduleMapper;
import com.buildguard.repository.ProjectRepository;
import com.buildguard.repository.ScheduleRepository;
import com.buildguard.service.ScheduleService;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final ProjectRepository projectRepository;
    private final ScheduleMapper scheduleMapper;

    public ScheduleServiceImpl(
            ScheduleRepository scheduleRepository,
            ProjectRepository projectRepository,
            ScheduleMapper scheduleMapper) {

        this.scheduleRepository = scheduleRepository;
        this.projectRepository = projectRepository;
        this.scheduleMapper = scheduleMapper;
    }

    @Override
    public ScheduleResponseDto createSchedule(
            String taskName,
            String description,
            String startDate,
            String endDate,
            String status,
            Long projectId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Schedule schedule = new Schedule();

        schedule.setTaskName(taskName);
        schedule.setDescription(description);
        schedule.setStartDate(LocalDate.parse(startDate));
        schedule.setEndDate(LocalDate.parse(endDate));
        schedule.setStatus(status);
        schedule.setCreatedAt(LocalDateTime.now());
        schedule.setProject(project);

        return scheduleMapper.toDto(scheduleRepository.save(schedule));
    }

    @Override
    public List<ScheduleResponseDto> getAllSchedules() {

        return scheduleRepository.findAll()
                .stream()
                .map(scheduleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ScheduleResponseDto getScheduleById(Long id) {

        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        return scheduleMapper.toDto(schedule);
    }

    @Override
    public List<ScheduleResponseDto> getSchedulesByProject(Long projectId) {

        return scheduleRepository.findByProjectId(projectId)
                .stream()
                .map(scheduleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ScheduleResponseDto updateSchedule(
            Long id,
            String taskName,
            String description,
            String startDate,
            String endDate,
            String status) {

        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        schedule.setTaskName(taskName);
        schedule.setDescription(description);
        schedule.setStartDate(LocalDate.parse(startDate));
        schedule.setEndDate(LocalDate.parse(endDate));
        schedule.setStatus(status);

        return scheduleMapper.toDto(scheduleRepository.save(schedule));
    }

    @Override
    public void deleteSchedule(Long id) {

        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        scheduleRepository.delete(schedule);
    }
}