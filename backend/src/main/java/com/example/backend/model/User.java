package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "users")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String email;
    private String phone;

    private String city;
    private String provinceOrState;
    private String country;

    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;

    private String university;
    private String degree;
    private String major;
    private Integer graduationYear;

    private String defaultResume;
    private String defaultCoverLetter;

    @OneToMany(mappedBy = "user")
    private List<JobApplication> applications;
}