package com.example.emp_crud.repositories;
import com.example.emp_crud.models.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByEntityAndEntityId(String entity, String entityId);
    List<AuditLog> findTop100ByOrderByCreatedAtDesc();
}
