package com.example.emp_crud.models;
import jakarta.persistence.*;
import lombok.*;
import java.sql.Date;

@Entity
@Table(name = "student")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "roll_number")
    private Integer rollNumber;

    @Column(nullable = false, length = 26)
    private String name;

    @Column(nullable = false, length = 1)
    private String gender;

    @Column(name = "date_of_birth", nullable = false)
    private Date dateOfBirth;

    @Column(name = "family_income", nullable = false)
    private Integer familyIncome;
}
