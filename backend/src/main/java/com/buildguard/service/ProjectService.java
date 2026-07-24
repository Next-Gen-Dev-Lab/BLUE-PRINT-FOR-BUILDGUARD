package com.buildguard.service;

import java.util.List;

import com.buildguard.dto.ProjectRequest;
import com.buildguard.dto.ProjectResponse;

public interface ProjectService {

    ProjectResponse createProject(ProjectRequest request);

    List<ProjectResponse> getAllProjects();

    ProjectResponse getProjectById(Long id);

    void deleteProject(Long id);

}