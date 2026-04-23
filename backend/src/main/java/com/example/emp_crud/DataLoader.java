package com.example.emp_crud;

import com.example.emp_crud.models.Admin;
import com.example.emp_crud.repositories.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final AdminRepository adminRepository;

    public DataLoader(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (adminRepository.count() == 0) {
            adminRepository.save(new Admin(null, "admin1", "admin123", "Admin One"));
            adminRepository.save(new Admin(null, "admin2", "admin456", "Admin Two"));
            System.out.println("Seeded default admins: admin1/admin123 and admin2/admin456");
        }
    }
}
