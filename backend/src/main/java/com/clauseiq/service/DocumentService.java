package com.clauseiq.service;

import com.clauseiq.model.Document;
import com.clauseiq.repository.DocumentRepository;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    public DocumentService(
            DocumentRepository documentRepository
    ) {
        this.documentRepository = documentRepository;
    }

    public Document saveDocument(
            MultipartFile file
    ) throws Exception {

        Document document = new Document();

        document.setFileName(
                file.getOriginalFilename()
        );

        document.setFileType(
                file.getContentType()
        );

        document.setFileSize(
                file.getSize()
        );

        document.setUploadedAt(
                LocalDateTime.now()
        );

        String extractedText =
                extractText(file);

        document.setExtractedText(
                extractedText
        );

        document.setStatus(
                "TEXT_EXTRACTED"
        );

        return documentRepository.save(
                document
        );
    }

    private String extractText(
            MultipartFile file
    ) throws Exception {

        String fileName =
                file.getOriginalFilename();

        if (fileName == null) {

            throw new Exception(
                    "File name is missing."
            );
        }

        if (fileName
                .toLowerCase()
                .endsWith(".pdf")) {

            return extractPdfText(file);

        } else if (fileName
                .toLowerCase()
                .endsWith(".docx")) {

            return extractDocxText(file);

        } else {

            throw new Exception(
                    "Unsupported file type. "
                            + "Only PDF and DOCX are supported."
            );
        }
    }

    private String extractPdfText(
            MultipartFile file
    ) throws Exception {

        byte[] fileBytes =
                file.getBytes();

        try (
                PDDocument pdfDocument =
                        Loader.loadPDF(fileBytes)
        ) {

            PDFTextStripper pdfTextStripper =
                    new PDFTextStripper();

            String text =
                    pdfTextStripper.getText(
                            pdfDocument
                    );

            return cleanText(text);
        }
    }

    private String extractDocxText(
            MultipartFile file
    ) throws Exception {

        try (
                InputStream inputStream =
                        file.getInputStream();

                XWPFDocument document =
                        new XWPFDocument(
                                inputStream
                        );

                XWPFWordExtractor extractor =
                        new XWPFWordExtractor(
                                document
                        )
        ) {

            String text =
                    extractor.getText();

            return cleanText(text);
        }
    }

    private String cleanText(
            String text
    ) {

        if (text == null) {
            return "";
        }

        return text
                .replace("\r\n", "\n")
                .replace("\r", "\n")
                .replaceAll("\n{3,}", "\n\n")
                .trim();
    }

    public List<Document> getAllDocuments() {

        return documentRepository.findAll();
    }

    public Document getDocumentById(
            Long id
    ) {

        return documentRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Document not found"
                        )
                );
    }
}