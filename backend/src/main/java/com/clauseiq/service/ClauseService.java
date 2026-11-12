package com.clauseiq.service;

import com.clauseiq.model.Clause;
import com.clauseiq.model.Document;
import com.clauseiq.repository.ClauseRepository;
import com.clauseiq.repository.DocumentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ClauseService {

    private final ClauseRepository clauseRepository;
    private final DocumentRepository documentRepository;

    public ClauseService(
            ClauseRepository clauseRepository,
            DocumentRepository documentRepository
    ) {
        this.clauseRepository = clauseRepository;
        this.documentRepository = documentRepository;
    }

    @Transactional
    public List<Clause> analyzeDocument(Long documentId) {

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() ->
                        new RuntimeException("Document not found")
                );

        String text = document.getExtractedText();

        if (text == null || text.trim().isEmpty()) {
            throw new RuntimeException(
                    "No extracted text found for this document"
            );
        }

        clauseRepository.deleteByDocumentId(documentId);

        List<Clause> clauses = new ArrayList<>();

        /*
         * Match every numbered clause heading.
         *
         * Example:
         *
         * 1. Services
         * 2. Fees and Payment
         * 3. Confidentiality
         *
         * We use MULTILINE so ^ means the beginning
         * of every line.
         */
        Pattern pattern = Pattern.compile(
                "^\\s*(\\d{1,2})\\.\\s+(.+)$",
                Pattern.MULTILINE
        );

        Matcher matcher = pattern.matcher(text);

        List<Integer> positions = new ArrayList<>();

        while (matcher.find()) {
            positions.add(matcher.start());
        }

        /*
         * If no numbered sections were found,
         * stop instead of creating one giant clause.
         */
        if (positions.isEmpty()) {

            throw new RuntimeException(
                    "No numbered clauses were detected in the document."
            );
        }

        /*
         * Extract each clause using the position of the
         * current heading and the next heading.
         */
        for (int i = 0; i < positions.size(); i++) {

            int start = positions.get(i);

            int end;

            if (i + 1 < positions.size()) {
                end = positions.get(i + 1);
            } else {
                end = text.length();
            }

            String clauseText =
                    text.substring(start, end).trim();

            /*
             * Remove the demo note from clause 12 if it
             * appears after the actual agreement.
             */
            if (clauseText.contains("ClauseIQ Demo Note:")) {

                clauseText =
                        clauseText.substring(
                                0,
                                clauseText.indexOf(
                                        "ClauseIQ Demo Note:"
                                )
                        ).trim();
            }

            if (clauseText.isEmpty()) {
                continue;
            }

            ClauseAnalysisResult result =
                    analyzeClause(clauseText);

            Clause clause = new Clause();

            clause.setDocument(document);
            clause.setClauseText(clauseText);
            clause.setClauseType(result.clauseType);
            clause.setRiskLevel(result.riskLevel);
            clause.setExplanation(result.explanation);
            clause.setRiskIndicators(result.riskIndicators);

            clauses.add(clause);
        }

        document.setStatus("ANALYZED");

        documentRepository.save(document);

        return clauseRepository.saveAll(clauses);
    }

    private ClauseAnalysisResult analyzeClause(
            String text
    ) {

        String lowerText =
                text.toLowerCase();

        List<String> indicators =
                new ArrayList<>();

        List<String> detectedTypes =
                new ArrayList<>();

        int riskScore = 0;

        // LIABILITY
        if (containsAny(
                lowerText,
                "liability",
                "liable",
                "indemnif",
                "hold harmless",
                "damages",
                "claims",
                "losses"
        )) {

            detectedTypes.add("Liability");

            if (containsAny(
                    lowerText,
                    "indemnif",
                    "hold harmless"
            )) {

                indicators.add(
                        "Indemnification"
                );

                riskScore += 30;
            }

            if (containsAny(
                    lowerText,
                    "liability",
                    "liable"
            )) {

                indicators.add(
                        "Liability obligation"
                );

                riskScore += 25;
            }

            if (containsAny(
                    lowerText,
                    "damages",
                    "losses"
            )) {

                indicators.add(
                        "Damages or financial exposure"
                );

                riskScore += 20;
            }

            if (containsAny(
                    lowerText,
                    "claims"
            )) {

                indicators.add(
                        "Third-party claims"
                );

                riskScore += 15;
            }
        }

        // DATA SHARING
        if (containsAny(
                lowerText,
                "data sharing",
                "share data",
                "share business data",
                "personal information",
                "personal data",
                "process personal",
                "data processing"
        )) {

            detectedTypes.add(
                    "Data Sharing"
            );

            indicators.add(
                    "Data processing or sharing"
            );

            riskScore += 25;

            if (containsAny(
                    lowerText,
                    "third party",
                    "third parties",
                    "service providers",
                    "retain information"
            )) {

                indicators.add(
                        "Third-party access or data retention"
                );

                riskScore += 20;
            }
        }

        // CONFIDENTIALITY
        if (containsAny(
                lowerText,
                "confidential",
                "confidentiality",
                "non-disclosure",
                "nda"
        )) {

            detectedTypes.add(
                    "Confidentiality"
            );

            indicators.add(
                    "Confidential information obligation"
            );

            riskScore += 15;

            if (containsAny(
                    lowerText,
                    "disclose",
                    "disclosure",
                    "third party",
                    "third parties"
            )) {

                indicators.add(
                        "Disclosure restrictions"
                );

                riskScore += 10;
            }
        }

        // RENEWAL
        if (containsAny(
                lowerText,
                "renewal",
                "renew",
                "automatically renew",
                "automatic renewal",
                "auto-renew"
        )) {

            detectedTypes.add(
                    "Renewal"
            );

            indicators.add(
                    "Renewal obligation"
            );

            riskScore += 20;

            if (containsAny(
                    lowerText,
                    "automatically renew",
                    "automatic renewal",
                    "auto-renew"
            )) {

                indicators.add(
                        "Automatic renewal"
                );

                riskScore += 15;
            }

            if (containsAny(
                    lowerText,
                    "notice",
                    "written notice"
            )) {

                indicators.add(
                        "Advance notice requirement"
                );

                riskScore += 10;
            }
        }

        // TERMINATION
        if (containsAny(
                lowerText,
                "termination",
                "terminate",
                "terminated"
        )) {

            detectedTypes.add(
                    "Termination"
            );

            indicators.add(
                    "Termination condition"
            );

            riskScore += 20;

            if (containsAny(
                    lowerText,
                    "immediately",
                    "immediate"
            )) {

                indicators.add(
                        "Immediate termination provision"
                );

                riskScore += 20;
            }

            if (containsAny(
                    lowerText,
                    "breach",
                    "cure",
                    "written notice"
            )) {

                indicators.add(
                        "Breach or cure requirement"
                );

                riskScore += 10;
            }
        }

        // PAYMENT
        if (containsAny(
                lowerText,
                "payment",
                "payments",
                "invoice",
                "fees",
                "late payment",
                "late payments"
        )) {

            detectedTypes.add(
                    "Payment"
            );

            indicators.add(
                    "Payment obligation"
            );

            riskScore += 10;

            if (containsAny(
                    lowerText,
                    "late",
                    "penalty",
                    "charge",
                    "charges"
            )) {

                indicators.add(
                        "Late payment charges"
                );

                riskScore += 15;
            }
        }

        // SECURITY
        if (containsAny(
                lowerText,
                "security",
                "safeguards",
                "unauthorized access",
                "cybersecurity",
                "information security"
        )) {

            detectedTypes.add(
                    "Security"
            );

            indicators.add(
                    "Security requirement"
            );

            riskScore += 10;

            if (containsAny(
                    lowerText,
                    "protect",
                    "unauthorized access",
                    "disclosure",
                    "destruction"
            )) {

                indicators.add(
                        "Information protection requirement"
                );

                riskScore += 10;
            }
        }

        // INTELLECTUAL PROPERTY
        if (containsAny(
                lowerText,
                "intellectual property",
                "copyright",
                "trademark",
                "software ownership",
                "ownership of intellectual property"
        )) {

            detectedTypes.add(
                    "Intellectual Property"
            );

            indicators.add(
                    "Intellectual property rights"
            );

            riskScore += 10;

            if (containsAny(
                    lowerText,
                    "non-exclusive",
                    "non-transferable",
                    "license",
                    "licence"
            )) {

                indicators.add(
                        "Usage or licensing restriction"
                );

                riskScore += 10;
            }
        }

        // GOVERNING LAW
        if (containsAny(
                lowerText,
                "governing law",
                "governed by the laws",
                "jurisdiction"
        )) {

            detectedTypes.add(
                    "Governing Law"
            );

            indicators.add(
                    "Jurisdiction or governing law"
            );

            riskScore += 5;
        }

        // GENERAL CONTRACTUAL OBLIGATION
        if (containsAny(
                lowerText,
                "must",
                "shall",
                "required",
                "obligation"
        )) {

            indicators.add(
                    "Contractual obligation"
            );

            riskScore += 5;
        }

        String clauseType;

        if (detectedTypes.isEmpty()) {

            clauseType = "General";

        } else {

            clauseType =
                    detectedTypes.get(0);

            if (detectedTypes.size() > 1) {

                clauseType =
                        detectedTypes.get(0)
                                + " & "
                                + detectedTypes.get(1);
            }
        }

        if (riskScore > 100) {
            riskScore = 100;
        }

        String riskLevel;

        if (riskScore >= 50) {

            riskLevel = "High";

        } else if (riskScore >= 25) {

            riskLevel = "Medium";

        } else {

            riskLevel = "Low";
        }

        List<String> uniqueIndicators =
                indicators.stream()
                        .distinct()
                        .toList();

        String riskIndicators;

        if (uniqueIndicators.isEmpty()) {

            riskIndicators =
                    "No significant risk indicators detected.";

        } else {

            riskIndicators =
                    String.join(
                            ", ",
                            uniqueIndicators
                    );
        }

        String explanation =
                generateExplanation(
                        clauseType,
                        riskLevel,
                        uniqueIndicators
                );

        return new ClauseAnalysisResult(
                clauseType,
                riskLevel,
                explanation,
                riskIndicators
        );
    }

    private String generateExplanation(
            String clauseType,
            String riskLevel,
            List<String> indicators
    ) {

        if (indicators.isEmpty()) {

            return
                    "No significant risk indicators were "
                            + "detected in this clause.";
        }

        String indicatorText =
                String.join(
                        ", ",
                        indicators
                );

        if (riskLevel.equals("High")) {

            return
                    "This clause contains "
                            + indicatorText.toLowerCase()
                            + ". These provisions may create "
                            + "significant contractual, financial, "
                            + "operational, or data-related obligations.";
        }

        if (riskLevel.equals("Medium")) {

            return
                    "This clause contains "
                            + indicatorText.toLowerCase()
                            + ". These provisions create "
                            + "contractual requirements that "
                            + "should be reviewed for their "
                            + "specific terms and conditions.";
        }

        return
                "This clause contains "
                        + indicatorText.toLowerCase()
                        + ". No major risk indicators were "
                        + "detected based on the current "
                        + "analysis rules.";
    }

    private boolean containsAny(
            String text,
            String... keywords
    ) {

        for (String keyword : keywords) {

            if (text.contains(keyword)) {
                return true;
            }
        }

        return false;
    }

    private static class ClauseAnalysisResult {

        private final String clauseType;
        private final String riskLevel;
        private final String explanation;
        private final String riskIndicators;

        private ClauseAnalysisResult(
                String clauseType,
                String riskLevel,
                String explanation,
                String riskIndicators
        ) {

            this.clauseType = clauseType;
            this.riskLevel = riskLevel;
            this.explanation = explanation;
            this.riskIndicators = riskIndicators;
        }
    }

    public List<Clause> getClausesByDocument(
            Long documentId
    ) {

        return clauseRepository.findByDocumentId(
                documentId
        );
    }

    public long getHighRiskCount() {

        return clauseRepository
                .countByRiskLevelIgnoreCase("High");
    }

    public long getMediumRiskCount() {

        return clauseRepository
                .countByRiskLevelIgnoreCase("Medium");
    }

    public long getLowRiskCount() {

        return clauseRepository
                .countByRiskLevelIgnoreCase("Low");
    }

    public double getComplianceScore() {

        long highRisk =
                getHighRiskCount();

        long mediumRisk =
                getMediumRiskCount();

        long lowRisk =
                getLowRiskCount();

        long totalClauses =
                highRisk
                        + mediumRisk
                        + lowRisk;

        if (totalClauses == 0) {
            return 0;
        }

        double totalPoints =
                (highRisk * 40.0)
                        + (mediumRisk * 70.0)
                        + (lowRisk * 100.0);

        double score =
                totalPoints / totalClauses;

        return Math.round(
                score * 10.0
        ) / 10.0;
    }
}