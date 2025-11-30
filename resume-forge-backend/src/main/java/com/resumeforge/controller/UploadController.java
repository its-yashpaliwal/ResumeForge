package com.resumeforge.controller;

import com.resumeforge.dto.UploadResponse;
import com.resumeforge.service.PdfTextExtractor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UploadController {

    private static final Path UPLOAD_DIR = Paths.get("uploads").toAbsolutePath().normalize();

    @Autowired
    private PdfTextExtractor pdfTextExtractor;

    public UploadController() throws IOException {
        Files.createDirectories(UPLOAD_DIR);
    }

    @PostMapping("/upload")
    public ResponseEntity<UploadResponse> uploadFiles(
            @RequestParam("resume") MultipartFile resume,
            @RequestParam("jd") MultipartFile jd) throws Exception {

        UUID jobId = UUID.randomUUID();

        Path resumePath = UPLOAD_DIR.resolve(jobId + "_resume_" + resume.getOriginalFilename());
        Path jdPath     = UPLOAD_DIR.resolve(jobId + "_jd_"     + jd.getOriginalFilename());

        Files.copy(resume.getInputStream(), resumePath);
        Files.copy(jd.getInputStream(),     jdPath);

        // EXTRACT TEXT
        String resumeText = pdfTextExtractor.extractText(resumePath.toFile());
        String jdText     = pdfTextExtractor.extractText(jdPath.toFile());

        // Print first 500 chars so you can see it works
        System.out.println("\nRESUME TEXT (first 500 chars):\n" + resumeText.substring(0, Math.min(500, resumeText.length())));
        System.out.println("\nJOB DESCRIPTION TEXT (first 500 chars):\n" + jdText.substring(0, Math.min(500, jdText.length())));

        return ResponseEntity.ok(
            new UploadResponse(jobId, "Files uploaded & text extracted! Check terminal →")
        );
    }
}