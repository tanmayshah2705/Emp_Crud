package com.example.emp_crud.models;
import jakarta.persistence.*;
import lombok.*;
import java.sql.Date;

@Entity
@Table(name = "employee")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @Column(name = "emp_id", length = 10)
    private String empId;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "date_of_birth", nullable = false)
    private Date dateOfBirth;

    @ManyToOne
    @JoinColumn(name = "city_code", nullable = false)
    private City city;

    @Column(nullable = false, length = 1)
    private String gender;

    @Column(nullable = false)
    private Integer salary;
}
