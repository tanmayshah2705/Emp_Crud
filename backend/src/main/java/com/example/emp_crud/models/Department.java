package com.example.emp_crud.models;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "department")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dept_code")
    private Integer deptCode;

    @Column(nullable = false, unique = true, length = 25)
    private String name;
}
