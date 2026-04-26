package com.example.emp_crud.controllers;

import com.example.emp_crud.models.Employee;
import com.example.emp_crud.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bulk")
public class BulkUploadController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping("/employees")
    public ResponseEntity<?> bulkUploadEmployees(@RequestParam("file") MultipartFile file) {
        List<String> errors = new ArrayList<>();
        int successCount = 0;

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            int lineNum = 0;

            while ((line = reader.readLine()) != null) {
                lineNum++;
                if (lineNum == 1) continue; // skip header

                try {
                    String[] parts = line.split(",");
                    if (parts.length < 5) {
                        errors.add("Line " + lineNum + ": Not enough columns");
                        continue;
                    }

                    Employee emp = new Employee();
                    emp.setEmpId(parts[0].trim());
                    emp.setName(parts[1].trim());
                    emp.setGender(parts[2].trim());
                    emp.setDateOfBirth(Date.valueOf(parts[3].trim()));
                    emp.setSalary(Integer.parseInt(parts[4].trim()));

                    employeeRepository.save(emp);
                    successCount++;
                } catch (Exception e) {
                    errors.add("Line " + lineNum + ": " + e.getMessage());
                }
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to read file: " + e.getMessage()));
        }

        return ResponseEntity.ok(Map.of(
            "success", successCount,
            "errors", errors,
            "total", successCount + errors.size()
        ));
    }
}
