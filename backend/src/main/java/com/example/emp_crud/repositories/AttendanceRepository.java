package com.example.emp_crud.repositories;
import com.example.emp_crud.models.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEmployeeId(String employeeId);
    Optional<Attendance> findByEmployeeIdAndDate(String employeeId, LocalDate date);
}
