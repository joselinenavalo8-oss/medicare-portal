package com.medicare.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clinical_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicalHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "patient_id", nullable = false)
    private Long patientId;
    
    @Column(name = "patient_name", nullable = false)
    private String patientName;
    
    @Column(nullable = false)
    private LocalDateTime date;
    
    @Column(nullable = false)
    private String diagnosis;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String treatment;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "doctor_name", nullable = false)
    private String doctorName;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (date == null) {
            date = LocalDateTime.now();
        }
    }
}
