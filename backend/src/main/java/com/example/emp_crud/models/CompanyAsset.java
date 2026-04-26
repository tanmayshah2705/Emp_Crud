package com.example.emp_crud.models;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "company_assets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyAsset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "asset_type", nullable = false)
    private String assetType; // LAPTOP, MONITOR, PHONE, KEYCARD

    @Column(name = "serial_number", nullable = false, unique = true)
    private String serialNumber;

    @Column(name = "assigned_to")
    private String assignedTo; // employee ID

    @Column(name = "assigned_name")
    private String assignedName;

    @Column(name = "warranty_expiry")
    private LocalDate warrantyExpiry;

    @Column(name = "asset_condition", nullable = false)
    private String assetCondition; // NEW, GOOD, FAIR, DAMAGED
}
