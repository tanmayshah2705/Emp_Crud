package com.example.emp_crud.models;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String role; // e.g., SUPER_ADMIN, HR_MANAGER, EMPLOYEE

    @Column(name = "employee_id")
    private String employeeId; // Link to Employee if role is EMPLOYEE
}
