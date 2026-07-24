package com.buildguard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.buildguard.entity.SafetyViolation;

@Repository
public interface SafetyViolationRepository extends JpaRepository<SafetyViolation, Long> {

    List<SafetyViolation> findByInspectionId(Long inspectionId);

    List<SafetyViolation> findByStatus(String status);

    List<SafetyViolation> findBySeverity(String severity);

}