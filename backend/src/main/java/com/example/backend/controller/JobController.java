package com.example.backend.controller;

import com.example.backend.model.JobApplication;
import com.example.backend.repository.JobRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;


import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

// File Storage
import com.example.backend.service.FileStorageService;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.io.IOException;
import java.nio.file.Files;
import java.security.NoSuchAlgorithmException;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public List<JobApplication> getAllJobs() {
        return jobRepository.findAll();
    }

    @PostMapping
    public JobApplication createJob(@RequestBody JobApplication job) {
        return jobRepository.save(job);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<JobApplication> updateJob(@PathVariable Long id, @RequestBody JobApplication update) {
        Optional<JobApplication> existing = jobRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        JobApplication existingApplication = existing.get();
        if (update.getCompanyName() != null) {
            existingApplication.setCompanyName(update.getCompanyName());
        }
        if (update.getRoleTitle() != null) {
            existingApplication.setRoleTitle(update.getRoleTitle());
        }
        if (update.getStatus() != null) {
            existingApplication.setStatus(update.getStatus());
        }
        if (update.getFollowUpDate() != null) {
            existingApplication.setFollowUpDate(update.getFollowUpDate());
        }
        if (update.getFollowUpCompleted() != null) {
            existingApplication.setFollowUpCompleted(update.getFollowUpCompleted());
        }
        if (update.getNotes() != null) {
            existingApplication.setNotes(update.getNotes());
        }
        if (update.getResumeUsed() != null) {
            existingApplication.setResumeUsed(update.getResumeUsed());
        }
        if (update.getCoverLetterUsed() != null) {
            existingApplication.setCoverLetterUsed(update.getCoverLetterUsed());
        }
        JobApplication saveUpdate = jobRepository.save(existingApplication);
        return ResponseEntity.ok(saveUpdate);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplication> getJob(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(value = "/resume/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadResume(@RequestParam("file") MultipartFile file)
            throws NoSuchAlgorithmException {
        try {
            String filename = fileStorageService.storeFile(file, "resumes");
            return ResponseEntity.ok(filename);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload file");
        }
    }

    @DeleteMapping("/resume/{filename}")
    public ResponseEntity<Void> deleteResume(@PathVariable String filename) {
        try {
            long count = jobRepository.countByResumeUsed(filename);
            if (count == 0) {
                fileStorageService.deleteFile(filename, "resumes");
            }
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllJobs() {
        jobRepository.deleteAll();
        return ResponseEntity.noContent().build();
    }
  
    @PostMapping(value = "/cover-letter/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadCoverLetter(@RequestParam("file") MultipartFile file) throws NoSuchAlgorithmException {
        try {
            String filename = fileStorageService.storeFile(file, "cover-letters");
            return ResponseEntity.ok(filename);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload cover letter");
        }
    }

    @DeleteMapping("/cover-letter/{filename}")
    public ResponseEntity<Void> deleteCoverLetter(@PathVariable String filename) {
        try {
            long count = jobRepository.countByCoverLetterUsed(filename);
            if (count == 0) {
                fileStorageService.deleteFile(filename, "cover-letters");
            }
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/resumes/list")
    public ResponseEntity<List<Map<String, String>>> listResumes() throws IOException {
        return ResponseEntity.ok(getFileList("uploads/resumes"));
    }

    @GetMapping("/cover-letters/list")
    public ResponseEntity<List<Map<String, String>>> listCoverLetters() throws IOException {
        return ResponseEntity.ok(getFileList("uploads/cover-letters"));
    }

    private List<Map<String, String>> getFileList(String directory) throws IOException {
    Path dirPath = Paths.get(directory);
    if (!Files.exists(dirPath)) return Collections.emptyList();

    return Files.list(dirPath)
        .map(path -> {
            String fullName = path.getFileName().toString();
            Map<String, String> fileInfo = new HashMap<>();
            fileInfo.put("hashed", fullName);
            int idx = fullName.indexOf("_");
            fileInfo.put("original", idx >= 0 ? fullName.substring(idx + 1) : fullName);
            return fileInfo;
        })
        .collect(Collectors.toList());
    }

    @GetMapping("/company")
    public List<JobApplication> findJobsByCompany(@RequestParam String name) {
        return jobRepository.findByCompanyNameIgnoreCase(name);
    }

}