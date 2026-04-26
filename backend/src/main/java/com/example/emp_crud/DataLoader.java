package com.example.emp_crud;

import com.example.emp_crud.models.*;
import com.example.emp_crud.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final InternRepository internRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final StateRepository stateRepository;
    private final CityRepository cityRepository;

    public DataLoader(UserRepository userRepository, 
                      InternRepository internRepository,
                      EmployeeRepository employeeRepository,
                      DepartmentRepository departmentRepository,
                      StateRepository stateRepository,
                      CityRepository cityRepository) {
        this.userRepository = userRepository;
        this.internRepository = internRepository;
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.stateRepository = stateRepository;
        this.cityRepository = cityRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed States
        if (stateRepository.count() == 0) {
            String[] stateNames = {"Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat", "West Bengal", "Telangana", "Uttar Pradesh", "Rajasthan", "Kerala"};
            for (String name : stateNames) {
                stateRepository.save(new State(null, name));
            }
            System.out.println("Seeded 10 states.");
        }

        // 2. Seed Cities (Linked to States)
        if (cityRepository.count() == 0) {
            List<State> states = stateRepository.findAll();
            String[][] cityData = {
                {"Mumbai", "Pune", "Nagpur"}, // MH
                {"Bangalore", "Mysore", "Hubli"}, // KA
                {"Chennai", "Coimbatore", "Madurai"}, // TN
                {"New Delhi", "Dwarka", "Rohini"}, // DL
                {"Ahmedabad", "Surat", "Vadodara"} // GJ
            };
            for (int i = 0; i < Math.min(states.size(), cityData.length); i++) {
                for (String cityName : cityData[i]) {
                    cityRepository.save(new City(null, cityName, states.get(i)));
                }
            }
            System.out.println("Seeded 15 cities.");
        }

        // 3. Seed Departments
        if (departmentRepository.count() == 0) {
            String[] deptNames = {"Engineering", "Product", "Design", "Marketing", "Sales", "Human Resources", "Finance", "Legal", "Operations", "Customer Support"};
            for (String name : deptNames) {
                departmentRepository.save(new Department(null, name));
            }
            System.out.println("Seeded 10 departments.");
        }

        // 4. Seed Employees (Linked to Cities)
        if (employeeRepository.count() == 0) {
            List<City> cities = cityRepository.findAll();
            String[] names = {"Arjun Singh", "Sneha Rao", "Vikram Malhotra", "Ananya Iyer", "Rohan Gupta", "Kavita Reddy", "Sanjay Verma", "Meera Nair", "Aditya Joshi", "Ishita Saxena", "Nikhil Deshmukh", "Zara Khan", "Varun Bhat", "Tanvi Shah", "Rishi Kapoor"};
            for (int i = 0; i < names.length; i++) {
                Employee emp = new Employee();
                emp.setEmpId("E" + (100 + i));
                emp.setName(names[i]);
                emp.setGender(i % 2 == 0 ? "M" : "F");
                emp.setDateOfBirth(Date.valueOf("199" + (i % 10) + "-0" + ((i % 9) + 1) + "-15"));
                emp.setCity(cities.get(i % cities.size()));
                emp.setSalary(50000 + (i * 5000));
                employeeRepository.save(emp);
            }
            System.out.println("Seeded 15 employees.");
        }

        // 5. Seed Users (Including linked Employees)
        if (userRepository.count() == 0) {
            userRepository.save(new User(null, "admin1", "admin123", "Admin One", "SUPER_ADMIN", null));
            userRepository.save(new User(null, "hr1", "hr123", "HR Manager", "HR_MANAGER", null));
            
            List<Employee> employees = employeeRepository.findAll();
            for (int i = 0; i < 5; i++) {
                Employee emp = employees.get(i);
                userRepository.save(new User(null, emp.getEmpId().toLowerCase(), "pass123", emp.getName(), "EMPLOYEE", emp.getEmpId()));
            }
            System.out.println("Seeded admins and 5 employee portal users.");
        }

        // 6. Seed Interns
        if (internRepository.count() == 0) {
            String[] internNames = {"Rahul Sharma", "Priya Patel", "Amit Verma", "Sonia Das", "Karan Johar", "Deepika Padukone", "Ranveer Singh", "Alia Bhatt", "Sid Malhotra", "Kiara Advani"};
            for (int i = 0; i < internNames.length; i++) {
                internRepository.save(new Intern(null, internNames[i], internNames[i].toLowerCase().replace(" ", ".") + "@example.com", i % 2 == 0 ? "M" : "F", "200" + (i % 5) + "-05-20", null, "Tech", 15000.0 + (i * 1000), "6 Months"));
            }
            System.out.println("Seeded 10 interns.");
        }
    }
}
