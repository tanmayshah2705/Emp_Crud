package com.example.emp_crud.repositories;
import com.example.emp_crud.models.Recognition;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecognitionRepository extends JpaRepository<Recognition, Long> {
    List<Recognition> findByToUser(String toUser);
    List<Recognition> findTop50ByOrderByCreatedAtDesc();
}
