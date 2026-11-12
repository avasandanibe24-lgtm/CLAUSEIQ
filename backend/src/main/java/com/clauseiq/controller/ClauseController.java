package com.clauseiq.controller;

import com.clauseiq.model.Clause;
import com.clauseiq.service.ClauseService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clauses")
@CrossOrigin(origins = "http://localhost:5173")
public class ClauseController {

    private final ClauseService clauseService;

    public ClauseController(ClauseService clauseService) {
        this.clauseService = clauseService;
    }

    @PostMapping("/analyze/{documentId}")
    public ResponseEntity<?> analyzeDocument(
            @PathVariable Long documentId
    ) {

        try {

            List<Clause> clauses =
                    clauseService.analyzeDocument(documentId);

            return ResponseEntity.ok(clauses);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<List<Clause>> getClauses(
            @PathVariable Long documentId
    ) {

        return ResponseEntity.ok(
                clauseService.getClausesByDocument(documentId)
        );
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {

        Map<String, Object> statistics =
                new HashMap<>();

        statistics.put(
                "highRisk",
                clauseService.getHighRiskCount()
        );

        statistics.put(
                "mediumRisk",
                clauseService.getMediumRiskCount()
        );

        statistics.put(
                "lowRisk",
                clauseService.getLowRiskCount()
        );

        statistics.put(
                "complianceScore",
                clauseService.getComplianceScore()
        );

        return ResponseEntity.ok(statistics);
    }
}