package com.buildguard.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.buildguard.dto.InspectionResponseDto;
import com.buildguard.entity.Inspection;
import com.buildguard.entity.ProgressLog;
import com.buildguard.entity.User;
import com.buildguard.exception.ResourceNotFoundException;
import com.buildguard.mapper.InspectionMapper;
import com.buildguard.repository.InspectionRepository;
import com.buildguard.repository.ProgressLogRepository;
import com.buildguard.repository.UserRepository;
import com.buildguard.service.InspectionService;

@Service
public class InspectionServiceImpl implements InspectionService {

    private static final String INSPECTION_NOT_FOUND = "Inspection not found";
    private static final String INSPECTOR_NOT_FOUND = "Inspector not found";
    private static final String PROGRESS_LOG_NOT_FOUND = "Progress Log not found";

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
                .orElseThrow(() ->
                        new ResourceNotFoundException(INSPECTOR_NOT_FOUND));

        ProgressLog progressLog = progressLogRepository.findById(progressLogId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(PROGRESS_LOG_NOT_FOUND));

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
                .toList();
    }

    @Override
    public InspectionResponseDto getInspectionById(Long id) {

        Inspection inspection = inspectionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(INSPECTION_NOT_FOUND));

        return inspectionMapper.toDto(inspection);
    }

    @Override
    public List<InspectionResponseDto> getInspectionsByProgressLog(Long progressLogId) {

        return inspectionRepository.findByProgressLogId(progressLogId)
                .stream()
                .map(inspectionMapper::toDto)
                .toList();
    }

    @Override
    public InspectionResponseDto updateInspection(
            Long id,
            String inspectionDate,
            String status,
            String remarks) {

        Inspection inspection = inspectionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(INSPECTION_NOT_FOUND));

        inspection.setInspectionDate(LocalDate.parse(inspectionDate));
        inspection.setStatus(status);
        inspection.setRemarks(remarks);

        Inspection updated = inspectionRepository.save(inspection);

        return inspectionMapper.toDto(updated);
    }

    @Override
    public void deleteInspection(Long id) {

        Inspection inspection = inspectionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(INSPECTION_NOT_FOUND));

        inspectionRepository.delete(inspection);
    }
}