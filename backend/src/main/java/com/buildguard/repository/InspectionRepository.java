package com.buildguard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.buildguard.entity.Inspection;

@Repository
public interface InspectionRepository extends JpaRepository<Inspection, Long> {

    List<Inspection> findByProgressLogId(Long progressLogId);

    List<Inspection> findByInspectorId(Long inspectorId);

    List<Inspection> findByStatus(String status);

}