package com.example.emp_crud.controllers;

import com.example.emp_crud.models.Expense;
import com.example.emp_crud.repositories.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @GetMapping
    public List<Expense> getAll() {
        return expenseRepository.findAll();
    }

    @GetMapping("/employee/{employeeId}")
    public List<Expense> getByEmployee(@PathVariable String employeeId) {
        return expenseRepository.findByEmployeeId(employeeId);
    }

    @PostMapping
    public Expense create(@RequestBody Expense expense) {
        expense.setStatus("PENDING");
        return expenseRepository.save(expense);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return expenseRepository.findById(id).map(e -> {
            e.setStatus("APPROVED");
            e.setApprovedBy(body.getOrDefault("approvedBy", "Admin"));
            expenseRepository.save(e);
            return ResponseEntity.ok(e);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return expenseRepository.findById(id).map(e -> {
            e.setStatus("REJECTED");
            e.setApprovedBy(body.getOrDefault("approvedBy", "Admin"));
            expenseRepository.save(e);
            return ResponseEntity.ok(e);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        expenseRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
