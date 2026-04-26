package com.example.emp_crud.controllers;

import com.example.emp_crud.models.Payslip;
import com.example.emp_crud.models.Attendance;
import com.example.emp_crud.repositories.PayslipRepository;
import com.example.emp_crud.repositories.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payslips")
public class PayslipController {

    @Autowired private PayslipRepository payslipRepository;
    @Autowired private AttendanceRepository attendanceRepository;

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
        // Automatic Salary Calculation based on Attendance
        List<Attendance> attendanceList = attendanceRepository.findByEmployeeId(payslip.getEmployeeId());
        
        // Simple logic: Assume 22 working days. 
        // For demo, we count "PRESENT" records for the month.
        long presentDays = attendanceList.stream()
            .filter(a -> a.getStatus().equalsIgnoreCase("PRESENT"))
            .count();
        
        if (presentDays < 20 && presentDays > 0) {
            double dailyRate = payslip.getBaseSalary() / 22;
            double attendanceDeduction = (22 - presentDays) * dailyRate;
            payslip.setDeductions(payslip.getDeductions() + attendanceDeduction);
        }

        payslip.setNetPay(payslip.getBaseSalary() - payslip.getDeductions() + payslip.getBonus());
        return payslipRepository.save(payslip);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        payslipRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
