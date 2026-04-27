package com.example.backend.service;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.security.NoSuchAlgorithmException;
import java.security.MessageDigest;
@Service
public class FileStorageService {

    private final Path resumeLocation = Paths.get("uploads/resumes");
    private final Path coverLetterLocation = Paths.get("uploads/cover-letters");

    public FileStorageService() throws IOException {
        Files.createDirectories(resumeLocation);
        Files.createDirectories(coverLetterLocation);
    }

    public String storeFile(MultipartFile file, String folder) throws IOException, NoSuchAlgorithmException {
        Path storageLocation = folder.equals("cover-letters") ? coverLetterLocation : resumeLocation;

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
            ? originalFilename.substring(originalFilename.lastIndexOf("."))
            : "";

        byte[] bytes = file.getBytes();
        StringBuilder hexHash = new StringBuilder();
        for (byte b : MessageDigest.getInstance("MD5").digest(bytes)) {
            hexHash.append(String.format("%02x", b));
        }

        String hashedFilename = hexHash.toString() + "_" + originalFilename;
        Path targetPath = storageLocation.resolve(hashedFilename);

        if (!Files.exists(targetPath)) {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        }

        return hashedFilename;
    }

    public void deleteFile(String filename, String folder) throws IOException {
        Path storageLocation = folder.equals("cover-letters") ? coverLetterLocation : resumeLocation;
        Path filePath = storageLocation.resolve(filename);
        Files.deleteIfExists(filePath);
    }
}