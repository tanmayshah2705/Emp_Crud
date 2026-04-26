package com.example.emp_crud.models;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recognitions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recognition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "from_user", nullable = false)
    private String fromUser;

    @Column(name = "from_name", nullable = false)
    private String fromName;

    @Column(name = "to_user", nullable = false)
    private String toUser;

    @Column(name = "to_name", nullable = false)
    private String toName;

    @Column(nullable = false, length = 500)
    private String message;

    @Column(nullable = false)
    private Integer points;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (points == null) points = 10;
    }
}
