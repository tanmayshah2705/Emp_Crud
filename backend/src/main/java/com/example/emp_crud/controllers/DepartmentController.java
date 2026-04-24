package com.example.emp_crud.controllers;

import com.example.emp_crud.models.Department;
import com.example.emp_crud.repositories.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
    @Autowired private DepartmentRepository departmentRepository;

    @GetMapping
    public List<Department> getAll() { return departmentRepository.findAll(); }

    @PostMapping
    public Department create(@RequestBody Department dept) { return departmentRepository.save(dept); }

    @PutMapping("/{id}")
    public ResponseEntity<Department> update(@PathVariable Integer id, @RequestBody Department details) {
        return departmentRepository.findById(id).map(dept -> {
            dept.setName(details.getName());
            return ResponseEntity.ok(departmentRepository.save(dept));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        return departmentRepository.findById(id).map(dept -> {
            departmentRepository.delete(dept);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
