package com.buildguard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.buildguard.entity.ProgressLog;

@Repository
public interface ProgressLogRepository extends JpaRepository<ProgressLog, Long> {

    List<ProgressLog> findByProjectId(Long projectId);

    List<ProgressLog> findByUserId(Long userId);

    List<ProgressLog> findByWorkStatus(String workStatus);

}