package com.clauseiq.model;

import jakarta.persistence.*;

@Entity
@Table(name = "clauses")
public class Clause {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "document_id")
    private Document document;

    @Column(columnDefinition = "TEXT")
    private String clauseText;

    private String clauseType;

    private String riskLevel;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(columnDefinition = "TEXT")
    private String riskIndicators;

    public Clause() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public String getClauseText() {
        return clauseText;
    }

    public void setClauseText(String clauseText) {
        this.clauseText = clauseText;
    }

    public String getClauseType() {
        return clauseType;
    }

    public void setClauseType(String clauseType) {
        this.clauseType = clauseType;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getRiskIndicators() {
        return riskIndicators;
    }

    public void setRiskIndicators(String riskIndicators) {
        this.riskIndicators = riskIndicators;
    }
}