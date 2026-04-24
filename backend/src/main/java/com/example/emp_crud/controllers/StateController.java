package com.example.emp_crud.controllers;

import com.example.emp_crud.models.State;
import com.example.emp_crud.repositories.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/states")
public class StateController {
    @Autowired private StateRepository stateRepository;

    @GetMapping
    public List<State> getAll() { return stateRepository.findAll(); }

    @PostMapping
    public State create(@RequestBody State state) { return stateRepository.save(state); }

    @PutMapping("/{id}")
    public ResponseEntity<State> update(@PathVariable Integer id, @RequestBody State details) {
        return stateRepository.findById(id).map(state -> {
            state.setName(details.getName());
            return ResponseEntity.ok(stateRepository.save(state));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        return stateRepository.findById(id).map(state -> {
            stateRepository.delete(state);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
