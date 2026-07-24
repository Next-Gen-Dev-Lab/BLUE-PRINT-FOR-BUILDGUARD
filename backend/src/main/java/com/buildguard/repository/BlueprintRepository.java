package com.buildguard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.buildguard.entity.Blueprint;

@Repository
public interface BlueprintRepository extends JpaRepository<Blueprint, Long> {

    List<Blueprint> findByProjectId(Long projectId);

}