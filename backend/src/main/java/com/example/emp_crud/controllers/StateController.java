package com.example.emp_crud.controllers;

import com.example.emp_crud.models.State;
import com.example.emp_crud.repositories.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/states")
public class StateController {

    @Autowired
    private StateRepository stateRepository;

    @GetMapping
    public List<State> getAllStates() {
        return stateRepository.findAll();
    }
}
