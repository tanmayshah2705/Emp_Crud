package com.example.emp_crud.controllers;

import com.example.emp_crud.models.Intern;
import com.example.emp_crud.repositories.InternRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interns")
public class InternController {

    @Autowired
    private InternRepository internRepository;

    @GetMapping
    public List<Intern> getAllInterns() {
        return internRepository.findAll();
    }

    @PostMapping
    public Intern createIntern(@RequestBody Intern intern) {
        return internRepository.save(intern);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Intern> getInternById(@PathVariable Long id) {
        return internRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Intern> updateIntern(@PathVariable Long id, @RequestBody Intern internDetails) {
        return internRepository.findById(id)
                .map(intern -> {
                    intern.setName(internDetails.getName());
                    intern.setEmail(internDetails.getEmail());
                    intern.setGender(internDetails.getGender());
                    intern.setDateOfBirth(internDetails.getDateOfBirth());
                    intern.setCity(internDetails.getCity());
                    intern.setDepartment(internDetails.getDepartment());
                    intern.setStipend(internDetails.getStipend());
                    intern.setInternshipPeriod(internDetails.getInternshipPeriod());
                    return ResponseEntity.ok(internRepository.save(intern));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIntern(@PathVariable Long id) {
        return internRepository.findById(id)
                .map(intern -> {
                    internRepository.delete(intern);
                    return ResponseEntity.ok().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
