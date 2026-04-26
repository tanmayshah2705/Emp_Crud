package com.example.emp_crud.controllers;

import com.example.emp_crud.models.LeaveRequest;
import com.example.emp_crud.repositories.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @GetMapping
    public List<LeaveRequest> getAll() {
        return leaveRequestRepository.findAll();
    }

    @GetMapping("/employee/{employeeId}")
    public List<LeaveRequest> getByEmployee(@PathVariable String employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }

    @GetMapping("/pending")
    public List<LeaveRequest> getPending() {
        return leaveRequestRepository.findByStatus("PENDING");
    }

    @PostMapping
    public LeaveRequest create(@RequestBody LeaveRequest leaveRequest) {
        leaveRequest.setStatus("PENDING");
        return leaveRequestRepository.save(leaveRequest);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return leaveRequestRepository.findById(id).map(lr -> {
            lr.setStatus("APPROVED");
            lr.setApprovedBy(body.getOrDefault("approvedBy", "Admin"));
            leaveRequestRepository.save(lr);
            return ResponseEntity.ok(lr);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return leaveRequestRepository.findById(id).map(lr -> {
            lr.setStatus("REJECTED");
            lr.setApprovedBy(body.getOrDefault("approvedBy", "Admin"));
            leaveRequestRepository.save(lr);
            return ResponseEntity.ok(lr);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        leaveRequestRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
