package com.example.emp_crud.controllers;

import com.example.emp_crud.models.Attendance;
import com.example.emp_crud.repositories.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @GetMapping
    public List<Attendance> getAll() {
        return attendanceRepository.findAll();
    }

    @GetMapping("/employee/{employeeId}")
    public List<Attendance> getByEmployee(@PathVariable String employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId);
    }

    @PostMapping("/clock-in")
    public ResponseEntity<?> clockIn(@RequestBody Map<String, String> body) {
        String employeeId = body.get("employeeId");
        String employeeName = body.getOrDefault("employeeName", "");
        LocalDate today = LocalDate.now();

        if (attendanceRepository.findByEmployeeIdAndDate(employeeId, today).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Already clocked in today"));
        }

        Attendance attendance = new Attendance();
        attendance.setEmployeeId(employeeId);
        attendance.setEmployeeName(employeeName);
        attendance.setDate(today);
        attendance.setClockIn(LocalTime.now());
        attendance.setStatus("PRESENT");
        attendanceRepository.save(attendance);
        return ResponseEntity.ok(attendance);
    }

    @PostMapping("/clock-out")
    public ResponseEntity<?> clockOut(@RequestBody Map<String, String> body) {
        String employeeId = body.get("employeeId");
        LocalDate today = LocalDate.now();

        return attendanceRepository.findByEmployeeIdAndDate(employeeId, today).map(attendance -> {
            if (attendance.getClockOut() != null) {
                return ResponseEntity.badRequest().body((Object) Map.of("message", "Already clocked out today"));
            }
            attendance.setClockOut(LocalTime.now());
            Duration duration = Duration.between(attendance.getClockIn(), attendance.getClockOut());
            double hours = duration.toMinutes() / 60.0;
            attendance.setTotalHours(Math.round(hours * 100.0) / 100.0);
            attendanceRepository.save(attendance);
            return ResponseEntity.ok((Object) attendance);
        }).orElse(ResponseEntity.badRequest().body((Object) Map.of("message", "You must clock in first")));
    }

    @GetMapping("/today/{employeeId}")
    public ResponseEntity<?> getTodayAttendance(@PathVariable String employeeId) {
        LocalDate today = LocalDate.now();
        return attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
            .map(a -> ResponseEntity.ok((Object) a))
            .orElse(ResponseEntity.ok((Object) Map.of("clocked", false)));
    }
}
