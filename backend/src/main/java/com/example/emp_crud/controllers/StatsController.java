package com.example.emp_crud.controllers;

import com.example.emp_crud.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {
    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private InternRepository internRepository;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private CityRepository cityRepository;
    @Autowired private StateRepository stateRepository;

    @GetMapping("/counts")
    public Map<String, Long> getCounts() {
        Map<String, Long> counts = new HashMap<>();
        counts.put("employees", employeeRepository.count());
        counts.put("interns", internRepository.count());
        counts.put("departments", departmentRepository.count());
        counts.put("cities", cityRepository.count());
        counts.put("states", stateRepository.count());
        return counts;
    }
}
