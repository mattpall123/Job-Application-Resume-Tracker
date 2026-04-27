package com.example.backend.repository;

import com.example.backend.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> id(Long id);
    long countByResumeUsed(String resumeUsed);
    long countByCoverLetterUsed(String coverLetterUsed);
    List<JobApplication> findByCompanyNameIgnoreCase(String companyName);
}