package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String companyName;

    private String roleTitle;

    private LocalDateTime applicationDate;

    private String status;

    private String notes;

    private LocalDateTime followUpDate;

    private Boolean followUpCompleted;

    private String resumeUsed;

    private String coverLetterUsed;

    private LocalDateTime createdAt;

    private LocalDateTime responseDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}