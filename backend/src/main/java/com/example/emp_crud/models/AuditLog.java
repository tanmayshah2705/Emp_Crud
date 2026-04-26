package com.example.emp_crud.models;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String entity; // EMPLOYEE, INTERN, DEPARTMENT, etc.

    @Column(name = "entity_id")
    private String entityId;

    @Column(nullable = false)
    private String action; // CREATE, UPDATE, DELETE

    @Column(name = "changed_by", nullable = false)
    private String changedBy;

    @Column(name = "old_value", length = 2000)
    private String oldValue;

    @Column(name = "new_value", length = 2000)
    private String newValue;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
