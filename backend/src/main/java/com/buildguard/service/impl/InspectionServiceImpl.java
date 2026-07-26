package com.buildguard.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.buildguard.dto.InspectionResponseDto;
import com.buildguard.entity.Inspection;
import com.buildguard.entity.ProgressLog;
import com.buildguard.entity.User;
import com.buildguard.mapper.InspectionMapper;
import com.buildguard.repository.InspectionRepository;
import com.buildguard.repository.ProgressLogRepository;
import com.buildguard.repository.UserRepository;
import com.buildguard.service.InspectionService;

@Service
public class InspectionServiceImpl implements InspectionService {

    private final InspectionRepository inspectionRepository;
    private final UserRepository userRepository;
    private final ProgressLogRepository progressLogRepository;
    private final InspectionMapper inspectionMapper;

    public InspectionServiceImpl(
            InspectionRepository inspectionRepository,
            UserRepository userRepository,
            ProgressLogRepository progressLogRepository,
            InspectionMapper inspectionMapper) {

        this.inspectionRepository = inspectionRepository;
        this.userRepository = userRepository;
        this.progressLogRepository = progressLogRepository;
        this.inspectionMapper = inspectionMapper;
    }

    @Override
    public InspectionResponseDto createInspection(
            String inspectionDate,
            String status,
            String remarks,
            Long inspectorId,
            Long progressLogId) {

        User inspector = userRepository.findById(inspectorId)
                .orElseThrow(() -> new RuntimeException("Inspector not found"));

        ProgressLog progressLog = progressLogRepository.findById(progressLogId)
                .orElseThrow(() -> new RuntimeException("Progress Log not found"));

        Inspection inspection = new Inspection();

        inspection.setInspectionDate(LocalDate.parse(inspectionDate));
        inspection.setStatus(status);
        inspection.setRemarks(remarks);
        inspection.setCreatedAt(LocalDateTime.now());
        inspection.setInspector(inspector);
        inspection.setProgressLog(progressLog);

        Inspection saved = inspectionRepository.save(inspection);

        return inspectionMapper.toDto(saved);
    }

    @Override
    public List<InspectionResponseDto> getAllInspections() {

        return inspectionRepository.findAll()
                .stream()
                .map(inspectionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public InspectionResponseDto getInspectionById(Long id) {

        Inspection inspection = inspectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inspection not found"));

        return inspectionMapper.toDto(inspection);
    }

    @Override
    public List<InspectionResponseDto> getInspectionsByProgressLog(Long progressLogId) {

        return inspectionRepository.findByProgressLogId(progressLogId)
                .stream()
                .map(inspectionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public InspectionResponseDto updateInspection(
            Long id,
            String inspectionDate,
            String status,
            String remarks) {

        Inspection inspection = inspectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inspection not found"));

        inspection.setInspectionDate(LocalDate.parse(inspectionDate));
        inspection.setStatus(status);
        inspection.setRemarks(remarks);

        Inspection updated = inspectionRepository.save(inspection);

        return inspectionMapper.toDto(updated);
    }

    @Override
    public void deleteInspection(Long id) {

        Inspection inspection = inspectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inspection not found"));

        inspectionRepository.delete(inspection);
    }
}