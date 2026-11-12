package com.clauseiq.repository;

import com.clauseiq.model.Clause;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClauseRepository extends JpaRepository<Clause, Long> {

    List<Clause> findByDocumentId(Long documentId);

    long countByRiskLevelIgnoreCase(String riskLevel);

    void deleteByDocumentId(Long documentId);
}