package com.example.emp_crud.models;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "city")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class City {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer code;

    @Column(nullable = false, unique = true, length = 35)
    private String name;

    @ManyToOne
    @JoinColumn(name = "state_code", nullable = false)
    private State state;
}
