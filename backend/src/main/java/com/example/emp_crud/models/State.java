package com.example.emp_crud.models;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "state")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class State {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer code;

    @Column(nullable = false, unique = true, length = 20)
    private String name;
}
