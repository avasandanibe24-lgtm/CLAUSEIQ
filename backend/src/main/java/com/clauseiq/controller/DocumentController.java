package com.clauseiq.controller;

import com.clauseiq.model.Document;
import com.clauseiq.service.DocumentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:5173")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file
    ) {

        try {

            if (file == null || file.isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("Please select a file.");
            }

            if (file.getSize() > 20 * 1024 * 1024) {
                return ResponseEntity
                        .badRequest()
                        .body("File size must be less than 20 MB.");
            }

            String contentType = file.getContentType();

            boolean isPdf =
                    "application/pdf".equals(contentType);

            boolean isDocx =
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            .equals(contentType);

            if (!isPdf && !isDocx) {
                return ResponseEntity
                        .badRequest()
                        .body("Only PDF and DOCX files are supported.");
            }

            Document document =
                    documentService.saveDocument(file);

            return ResponseEntity.ok(document);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to upload document: "
                                    + e.getMessage()
                    );
        }
    }

    @GetMapping
    public ResponseEntity<List<Document>> getDocuments() {

        return ResponseEntity.ok(
                documentService.getAllDocuments()
        );
    }

    /*
     * Temporary debugging endpoint.
     * This lets us see exactly what PDFBox extracted
     * from the uploaded document.
     */
    @GetMapping("/{id}/text")
    public ResponseEntity<?> getDocumentText(
            @PathVariable Long id
    ) {

        try {

            Document document =
                    documentService.getDocumentById(id);

            return ResponseEntity.ok(
                    document.getExtractedText()
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}