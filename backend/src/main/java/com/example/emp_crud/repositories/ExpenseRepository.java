package com.example.emp_crud.repositories;
import com.example.emp_crud.models.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByEmployeeId(String employeeId);
    List<Expense> findByStatus(String status);
}
