package com.example.emp_crud;

import com.example.emp_crud.models.User;
import com.example.emp_crud.models.Intern;
import com.example.emp_crud.repositories.UserRepository;
import com.example.emp_crud.repositories.InternRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final InternRepository internRepository;

    public DataLoader(UserRepository userRepository, InternRepository internRepository) {
        this.userRepository = userRepository;
        this.internRepository = internRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            userRepository.save(new User(null, "admin1", "admin123", "Admin One", "SUPER_ADMIN", null));
            userRepository.save(new User(null, "admin2", "admin456", "Admin Two", "SUPER_ADMIN", null));
            System.out.println("Seeded default admins.");
        }

        if (internRepository.count() == 0) {
            internRepository.save(new Intern(null, "Rahul Sharma", "rahul@example.com", "M", "2002-05-15", null, "IT", 15000.0, "6 Months"));
            internRepository.save(new Intern(null, "Priya Patel", "priya@example.com", "F", "2003-08-22", null, "Development", 18000.0, "3 Months"));
            internRepository.save(new Intern(null, "Amit Verma", "amit@example.com", "M", "2001-12-10", null, "Testing", 12000.0, "6 Months"));
            System.out.println("Seeded sample interns with full details.");
        }
    }
}
