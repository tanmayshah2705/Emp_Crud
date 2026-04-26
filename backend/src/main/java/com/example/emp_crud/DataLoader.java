package com.example.emp_crud;

import com.example.emp_crud.models.*;
import com.example.emp_crud.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final InternRepository internRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final StateRepository stateRepository;
    private final CityRepository cityRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final ExpenseRepository expenseRepository;
    private final PayslipRepository payslipRepository;
    private final AssetRepository assetRepository;
    private final RecognitionRepository recognitionRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationRepository notificationRepository;

    public DataLoader(UserRepository userRepository, 
                      InternRepository internRepository,
                      EmployeeRepository employeeRepository,
                      DepartmentRepository departmentRepository,
                      StateRepository stateRepository,
                      CityRepository cityRepository,
                      AttendanceRepository attendanceRepository,
                      LeaveRequestRepository leaveRequestRepository,
                      ExpenseRepository expenseRepository,
                      PayslipRepository payslipRepository,
                      AssetRepository assetRepository,
                      RecognitionRepository recognitionRepository,
                      AuditLogRepository auditLogRepository,
                      NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.internRepository = internRepository;
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.stateRepository = stateRepository;
        this.cityRepository = cityRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.expenseRepository = expenseRepository;
        this.payslipRepository = payslipRepository;
        this.assetRepository = assetRepository;
        this.recognitionRepository = recognitionRepository;
        this.auditLogRepository = auditLogRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed States
        if (stateRepository.count() == 0) {
            String[] stateNames = {"Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat", "West Bengal", "Telangana", "Uttar Pradesh", "Rajasthan", "Kerala"};
            for (String name : stateNames) {
                stateRepository.save(new State(null, name));
            }
        }

        // 2. Seed Cities
        if (cityRepository.count() == 0) {
            List<State> states = stateRepository.findAll();
            String[][] cityData = {
                {"Mumbai", "Pune", "Nagpur"}, {"Bangalore", "Mysore"}, {"Chennai", "Coimbatore"}, {"New Delhi"}, {"Ahmedabad"}
            };
            for (int i = 0; i < Math.min(states.size(), cityData.length); i++) {
                for (String cityName : cityData[i]) {
                    cityRepository.save(new City(null, cityName, states.get(i)));
                }
            }
        }

        // 3. Seed Departments
        if (departmentRepository.count() == 0) {
            String[] deptNames = {"Engineering", "Product", "HR", "Sales", "Finance", "Operations"};
            for (String name : deptNames) {
                departmentRepository.save(new Department(null, name));
            }
        }

        // 4. Seed Employees
        if (employeeRepository.count() == 0) {
            List<City> cities = cityRepository.findAll();
            String[] names = {"Arjun Singh", "Sneha Rao", "Vikram Malhotra", "Ananya Iyer", "Rohan Gupta", "Kavita Reddy", "Sanjay Verma", "Meera Nair", "Aditya Joshi", "Ishita Saxena"};
            for (int i = 0; i < names.length; i++) {
                Employee emp = new Employee();
                emp.setEmpId("E10" + i);
                emp.setName(names[i]);
                emp.setGender(i % 2 == 0 ? "M" : "F");
                emp.setDateOfBirth(Date.valueOf("199" + (i % 10) + "-05-15"));
                emp.setCity(cities.get(i % cities.size()));
                emp.setSalary(60000 + (i * 2000));
                employeeRepository.save(emp);
            }
        }

        // 5. Seed Users (Critical Fix for Credentials)
        if (userRepository.findByUsername("admin1").isEmpty()) {
            userRepository.save(new User(null, "admin1", "admin123", "Admin One", "SUPER_ADMIN", null));
        }
        if (userRepository.findByUsername("hr1").isEmpty()) {
            userRepository.save(new User(null, "hr1", "hr123", "HR Manager", "HR_MANAGER", null));
        }
        
        List<Employee> employees = employeeRepository.findAll();
        for (Employee emp : employees) {
            if (userRepository.findByUsername(emp.getEmpId().toLowerCase()).isEmpty()) {
                userRepository.save(new User(null, emp.getEmpId().toLowerCase(), "pass123", emp.getName(), "EMPLOYEE", emp.getEmpId()));
            }
        }

        // 6. Seed Attendance
        if (attendanceRepository.count() == 0) {
            for (Employee emp : employees) {
                for (int i = 1; i <= 10; i++) {
                    Attendance att = new Attendance();
                    att.setEmployeeId(emp.getEmpId());
                    att.setEmployeeName(emp.getName());
                    att.setClockIn(LocalTime.of(9, 0));
                    att.setClockOut(LocalTime.of(18, 0));
                    att.setTotalHours(9.0);
                    att.setDate(LocalDate.now().minusDays(i));
                    att.setStatus("PRESENT");
                    attendanceRepository.save(att);
                }
            }
        }

        // 7. Seed Leave Requests & Notifications
        if (leaveRequestRepository.count() == 0) {
            for (int i = 0; i < 5; i++) {
                Employee emp = employees.get(i % employees.size());
                LeaveRequest lr = new LeaveRequest();
                lr.setEmployeeId(emp.getEmpId());
                lr.setEmployeeName(emp.getName());
                lr.setLeaveType("CASUAL");
                lr.setStartDate(LocalDate.now().plusDays(5));
                lr.setEndDate(LocalDate.now().plusDays(7));
                lr.setReason("Personal Work");
                lr.setStatus("PENDING");
                leaveRequestRepository.save(lr);
                
                // Add notification for HR
                notificationRepository.save(new Notification(null, "hr1", "New leave request from " + emp.getName(), false, java.time.LocalDateTime.now()));
            }
        }

        // 8. Seed Assets
        if (assetRepository.count() == 0) {
            for (int i = 0; i < 5; i++) {
                CompanyAsset asset = new CompanyAsset();
                asset.setAssetType("LAPTOP");
                asset.setSerialNumber("SN-" + (5000 + i));
                asset.setAssignedTo(employees.get(i).getEmpId());
                asset.setAssignedName(employees.get(i).getName());
                asset.setAssetCondition("GOOD");
                asset.setWarrantyExpiry(LocalDate.now().plusYears(1));
                assetRepository.save(asset);
            }
        }
        
        System.out.println("DataLoader: Database sync complete with latest credentials.");
    }
}
