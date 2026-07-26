package com.buildguard.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.buildguard.dto.ProjectRequest;
import com.buildguard.dto.ProjectResponse;
import com.buildguard.entity.Project;
import com.buildguard.mapper.ProjectMapper;
import com.buildguard.repository.ProjectRepository;
import com.buildguard.service.ProjectService;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public ProjectResponse createProject(ProjectRequest request) {

        if (projectRepository.existsByProjectName(request.getProjectName())) {
            throw new RuntimeException("Project already exists");
        }

        Project project = ProjectMapper.toEntity(request);

        Project savedProject = projectRepository.save(project);

        return ProjectMapper.toResponse(savedProject);
    }

    @Override
    public List<ProjectResponse> getAllProjects() {

        return projectRepository.findAll()
                .stream()
                .map(ProjectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectResponse getProjectById(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return ProjectMapper.toResponse(project);
    }

    @Override
    public void deleteProject(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        projectRepository.delete(project);
    }
}