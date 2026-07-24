package com.buildguard.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.buildguard.dto.ProgressLogResponseDto;
import com.buildguard.entity.ProgressLog;
import com.buildguard.entity.Project;
import com.buildguard.entity.User;
import com.buildguard.exception.ResourceNotFoundException;
import com.buildguard.mapper.ProgressLogMapper;
import com.buildguard.repository.ProgressLogRepository;
import com.buildguard.repository.ProjectRepository;
import com.buildguard.repository.UserRepository;
import com.buildguard.service.ProgressLogService;
import com.buildguard.service.S3Service;

@Service
public class ProgressLogServiceImpl implements ProgressLogService {

    private static final String PROJECT_NOT_FOUND = "Project not found";
    private static final String USER_NOT_FOUND = "User not found";
    private static final String UPLOADER_NOT_FOUND = "Uploaded By User not found";
    private static final String PROGRESS_LOG_NOT_FOUND = "Progress Log not found";

    private final ProgressLogRepository progressLogRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProgressLogMapper progressLogMapper;
    private final S3Service s3Service;

    public ProgressLogServiceImpl(
            ProgressLogRepository progressLogRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository,
            ProgressLogMapper progressLogMapper,
            S3Service s3Service) {

        this.progressLogRepository = progressLogRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.progressLogMapper = progressLogMapper;
        this.s3Service = s3Service;
    }

    @Override
    public ProgressLogResponseDto uploadProgressLog(
            String description,
            String workDate,
            String workStatus,
            Long projectId,
            Long userId,
            Long uploadedBy,
            MultipartFile image) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException(PROJECT_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(USER_NOT_FOUND));

        User uploader = userRepository.findById(uploadedBy)
                .orElseThrow(() -> new ResourceNotFoundException(UPLOADER_NOT_FOUND));

        String imageUrl = s3Service.uploadFile(image);

        ProgressLog progressLog = new ProgressLog();

        progressLog.setDescription(description);
        progressLog.setImageName(image.getOriginalFilename());
        progressLog.setImageSize(image.getSize());
        progressLog.setImageType(image.getContentType());
        progressLog.setImageUrl(imageUrl);
        progressLog.setUploadedAt(LocalDateTime.now());
        progressLog.setCreatedAt(LocalDateTime.now());
        progressLog.setWorkDate(LocalDate.parse(workDate));
        progressLog.setWorkStatus(workStatus);
        progressLog.setProject(project);
        progressLog.setUser(user);
        progressLog.setUploadedBy(uploader);

        ProgressLog savedProgressLog = progressLogRepository.save(progressLog);

        return progressLogMapper.toDto(savedProgressLog);
    }

    @Override
    public List<ProgressLogResponseDto> getAllProgressLogs() {

        return progressLogRepository.findAll()
                .stream()
                .map(progressLogMapper::toDto)
                .toList();
    }

    @Override
    public ProgressLogResponseDto getProgressLogById(Long id) {

        ProgressLog progressLog = progressLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(PROGRESS_LOG_NOT_FOUND));

        return progressLogMapper.toDto(progressLog);
    }

    @Override
    public List<ProgressLogResponseDto> getProgressLogsByProject(Long projectId) {

        return progressLogRepository.findByProjectId(projectId)
                .stream()
                .map(progressLogMapper::toDto)
                .toList();
    }

    @Override
    public ProgressLogResponseDto updateProgressLog(
            Long id,
            String description,
            String workDate,
            String workStatus,
            MultipartFile image) {

        ProgressLog progressLog = progressLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(PROGRESS_LOG_NOT_FOUND));

        progressLog.setDescription(description);
        progressLog.setWorkDate(LocalDate.parse(workDate));
        progressLog.setWorkStatus(workStatus);

        if (image != null && !image.isEmpty()) {

            if (progressLog.getImageUrl() != null
                    && !progressLog.getImageUrl().isEmpty()) {

                String oldKey = progressLog.getImageUrl()
                        .substring(progressLog.getImageUrl().lastIndexOf('/') + 1);

                s3Service.deleteFile(oldKey);
            }

            String imageUrl = s3Service.uploadFile(image);

            progressLog.setImageName(image.getOriginalFilename());
            progressLog.setImageSize(image.getSize());
            progressLog.setImageType(image.getContentType());
            progressLog.setImageUrl(imageUrl);
            progressLog.setUploadedAt(LocalDateTime.now());
        }

        ProgressLog updatedProgressLog = progressLogRepository.save(progressLog);

        return progressLogMapper.toDto(updatedProgressLog);
    }

    @Override
    public void deleteProgressLog(Long id) {

        ProgressLog progressLog = progressLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(PROGRESS_LOG_NOT_FOUND));

        if (progressLog.getImageUrl() != null
                && !progressLog.getImageUrl().isEmpty()) {

            String fileKey = progressLog.getImageUrl()
                    .substring(progressLog.getImageUrl().lastIndexOf('/') + 1);

            s3Service.deleteFile(fileKey);
        }

        progressLogRepository.deleteById(id);
    }
}