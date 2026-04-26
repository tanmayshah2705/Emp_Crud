package com.example.emp_crud.controllers;

import com.example.emp_crud.models.AuditLog;
import com.example.emp_crud.repositories.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping
    public List<AuditLog> getRecent() {
        return auditLogRepository.findTop100ByOrderByCreatedAtDesc();
    }

    @GetMapping("/{entity}/{entityId}")
    public List<AuditLog> getByEntity(@PathVariable String entity, @PathVariable String entityId) {
        return auditLogRepository.findByEntityAndEntityId(entity, entityId);
    }

    @PostMapping
    public AuditLog create(@RequestBody AuditLog auditLog) {
        return auditLogRepository.save(auditLog);
    }
}
