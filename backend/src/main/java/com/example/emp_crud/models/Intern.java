package com.example.emp_crud.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "intern")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Intern {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String gender;
    
    @Column(name = "date_of_birth")
    private String dateOfBirth;

    @ManyToOne
    @JoinColumn(name = "city_code")
    private City city;

    private String department;
    
    private Double stipend;

    @Column(name = "internship_period")
    private String internshipPeriod; // e.g., "6 Months"
}
