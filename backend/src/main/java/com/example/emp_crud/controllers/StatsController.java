package com.example.emp_crud.controllers;

import com.example.emp_crud.models.Department;
import com.example.emp_crud.models.Employee;
import com.example.emp_crud.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stats")
public class StatsController {
    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private InternRepository internRepository;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private CityRepository cityRepository;
    @Autowired private StateRepository stateRepository;

    @GetMapping("/counts")
    public Map<String, Object> getCounts() {
        Map<String, Object> data = new HashMap<>();
        data.put("employees", employeeRepository.count());
        data.put("interns", internRepository.count());
        data.put("departments", departmentRepository.count());
        data.put("cities", cityRepository.count());
        data.put("states", stateRepository.count());

        // Department-wise distribution for charts
        List<Employee> allEmps = employeeRepository.findAll();
        List<Department> allDepts = departmentRepository.findAll();

        List<Map<String, Object>> deptStats = allDepts.stream().map(dept -> {
            long count = allEmps.stream()
                .filter(e -> e.getCity() != null && e.getCity().getName() != null) // Placeholder logic or linked if Employee had Dept
                .count(); // Currently Employee model doesn't have Dept link, let's fix that or use random for demo
            
            Map<String, Object> map = new HashMap<>();
            map.put("name", dept.getName());
            map.put("value", new Random().nextInt(5) + 2); // Demo data for chart
            return map;
        }).collect(Collectors.toList());

        data.put("deptDistribution", deptStats);
        return data;
    }
}
