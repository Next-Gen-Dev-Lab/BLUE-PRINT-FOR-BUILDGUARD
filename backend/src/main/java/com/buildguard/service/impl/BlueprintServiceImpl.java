package com.buildguard.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.buildguard.dto.BlueprintResponseDto;
import com.buildguard.entity.Blueprint;
import com.buildguard.entity.Project;
import com.buildguard.mapper.BlueprintMapper;
import com.buildguard.repository.BlueprintRepository;
import com.buildguard.repository.ProjectRepository;
import com.buildguard.service.BlueprintService;
import com.buildguard.service.S3Service;

@Service
public class BlueprintServiceImpl implements BlueprintService {

    private final BlueprintRepository blueprintRepository;
    private final ProjectRepository projectRepository;
    private final BlueprintMapper blueprintMapper;
    private final S3Service s3Service;

    public BlueprintServiceImpl(BlueprintRepository blueprintRepository,
                                ProjectRepository projectRepository,
                                BlueprintMapper blueprintMapper,
                                S3Service s3Service) {

        this.blueprintRepository = blueprintRepository;
        this.projectRepository = projectRepository;
        this.blueprintMapper = blueprintMapper;
        this.s3Service = s3Service;
    }

   
    @Override
    public BlueprintResponseDto uploadBlueprint(Long projectId,
                                                String blueprintName,
                                                String description,
                                                MultipartFile file) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        String fileUrl = s3Service.uploadFile(file);

        Blueprint blueprint = new Blueprint();

        blueprint.setBlueprintName(blueprintName);
        blueprint.setDescription(description);
        blueprint.setFileName(file.getOriginalFilename());
        blueprint.setFileSize(file.getSize());                 // NEW
        blueprint.setFileType(file.getContentType());          // NEW
        blueprint.setFileUrl(fileUrl);
        blueprint.setUploadedAt(LocalDateTime.now());
        blueprint.setProject(project);

        Blueprint savedBlueprint = blueprintRepository.save(blueprint);

        return blueprintMapper.toDto(savedBlueprint);
    }

    @Override
    public List<BlueprintResponseDto> getAllBlueprints() {

        return blueprintRepository.findAll()
                .stream()
                .map(blueprintMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public BlueprintResponseDto getBlueprintById(Long id) {

        Blueprint blueprint = blueprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blueprint not found"));

        return blueprintMapper.toDto(blueprint);
    }

    @Override
    public List<BlueprintResponseDto> getBlueprintsByProject(Long projectId) {

        return blueprintRepository.findByProjectId(projectId)
                .stream()
                .map(blueprintMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteBlueprint(Long id) {

        Blueprint blueprint = blueprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blueprint not found"));

        String fileUrl = blueprint.getFileUrl();

        if (fileUrl != null && !fileUrl.isEmpty()) {

            String fileKey = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

            s3Service.deleteFile(fileKey);
        }

        blueprintRepository.deleteById(id);
    }
}