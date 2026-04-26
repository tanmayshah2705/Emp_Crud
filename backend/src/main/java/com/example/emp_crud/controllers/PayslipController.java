package com.example.emp_crud.controllers;

import com.example.emp_crud.models.Payslip;
import com.example.emp_crud.repositories.PayslipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payslips")
public class PayslipController {

    @Autowired
    private PayslipRepository payslipRepository;

    @GetMapping
    public List<Payslip> getAll() {
        return payslipRepository.findAll();
    }

    @GetMapping("/employee/{employeeId}")
    public List<Payslip> getByEmployee(@PathVariable String employeeId) {
        return payslipRepository.findByEmployeeId(employeeId);
    }

    @PostMapping
    public Payslip create(@RequestBody Payslip payslip) {
        payslip.setNetPay(payslip.getBaseSalary() - payslip.getDeductions() + payslip.getBonus());
        return payslipRepository.save(payslip);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        payslipRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
