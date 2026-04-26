package com.example.emp_crud.controllers;

import com.example.emp_crud.models.Recognition;
import com.example.emp_crud.repositories.RecognitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recognitions")
public class RecognitionController {

    @Autowired
    private RecognitionRepository recognitionRepository;

    @GetMapping
    public List<Recognition> getRecent() {
        return recognitionRepository.findTop50ByOrderByCreatedAtDesc();
    }

    @GetMapping("/user/{userId}")
    public List<Recognition> getByUser(@PathVariable String userId) {
        return recognitionRepository.findByToUser(userId);
    }

    @PostMapping
    public Recognition create(@RequestBody Recognition recognition) {
        return recognitionRepository.save(recognition);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        recognitionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
