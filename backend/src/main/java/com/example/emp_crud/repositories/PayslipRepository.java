package com.example.emp_crud.repositories;
import com.example.emp_crud.models.Payslip;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PayslipRepository extends JpaRepository<Payslip, Long> {
    List<Payslip> findByEmployeeId(String employeeId);
    List<Payslip> findByMonthAndYear(String month, Integer year);
}
