package com.example.emp_crud.models;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payslips")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payslip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private String employeeId;

    @Column(name = "employee_name", nullable = false)
    private String employeeName;

    @Column(nullable = false)
    private String month; // e.g. "January"

    @Column(nullable = false)
    private Integer year;

    @Column(name = "base_salary", nullable = false)
    private Double baseSalary;

    @Column(nullable = false)
    private Double deductions;

    @Column(nullable = false)
    private Double bonus;

    @Column(name = "net_pay", nullable = false)
    private Double netPay;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    @PrePersist
    protected void onCreate() {
        generatedAt = LocalDateTime.now();
        netPay = baseSalary - deductions + bonus;
    }
}
