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
                      AuditLogRepository auditLogRepository) {
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
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed States
        if (stateRepository.count() == 0) {
            String[] stateNames = {"Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat", "West Bengal", "Telangana", "Uttar Pradesh", "Rajasthan", "Kerala"};
            for (String name : stateNames) {
                stateRepository.save(new State(null, name));
            }
            System.out.println("Seeded states.");
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
            System.out.println("Seeded cities.");
        }

        // 3. Seed Departments
        if (departmentRepository.count() == 0) {
            String[] deptNames = {"Engineering", "Product", "HR", "Sales", "Finance", "Operations"};
            for (String name : deptNames) {
                departmentRepository.save(new Department(null, name));
            }
            System.out.println("Seeded departments.");
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
            System.out.println("Seeded employees.");
        }

        // 5. Seed Users
        if (userRepository.count() == 0) {
            userRepository.save(new User(null, "admin1", "admin123", "Admin One", "SUPER_ADMIN", null));
            userRepository.save(new User(null, "hr1", "hr123", "HR Manager", "HR_MANAGER", null));
            List<Employee> employees = employeeRepository.findAll();
            for (Employee emp : employees) {
                userRepository.save(new User(null, emp.getEmpId().toLowerCase(), "pass123", emp.getName(), "EMPLOYEE", emp.getEmpId()));
            }
            System.out.println("Seeded users.");
        }

        List<Employee> employees = employeeRepository.findAll();

        // 6. Seed Attendance (Last 5 days for each employee)
        if (attendanceRepository.count() == 0) {
            for (Employee emp : employees) {
                for (int i = 1; i <= 5; i++) {
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
            System.out.println("Seeded attendance logs.");
        }

        // 7. Seed Leave Requests
        if (leaveRequestRepository.count() == 0) {
            String[] reasons = {"Family Function", "Medical Leave", "Personal Work", "Vacation"};
            for (int i = 0; i < 10; i++) {
                Employee emp = employees.get(i % employees.size());
                LeaveRequest lr = new LeaveRequest();
                lr.setEmployeeId(emp.getEmpId());
                lr.setEmployeeName(emp.getName());
                lr.setLeaveType(i % 2 == 0 ? "CASUAL" : "SICK");
                lr.setStartDate(LocalDate.now().plusDays(10 + i));
                lr.setEndDate(LocalDate.now().plusDays(12 + i));
                lr.setReason(reasons[i % reasons.length]);
                lr.setStatus(i % 3 == 0 ? "APPROVED" : (i % 3 == 1 ? "PENDING" : "REJECTED"));
                leaveRequestRepository.save(lr);
            }
            System.out.println("Seeded leave requests.");
        }

        // 8. Seed Expenses
        if (expenseRepository.count() == 0) {
            String[] cats = {"TRAVEL", "MEALS", "OFFICE_SUPPLIES"};
            for (int i = 0; i < 10; i++) {
                Employee emp = employees.get(i % employees.size());
                Expense exp = new Expense();
                exp.setEmployeeId(emp.getEmpId());
                exp.setEmployeeName(emp.getName());
                exp.setCategory(cats[i % cats.length]);
                exp.setAmount(500.0 * (i + 1));
                exp.setDescription("Sample expense for " + cats[i % cats.length].toLowerCase());
                exp.setStatus(i % 2 == 0 ? "APPROVED" : "PENDING");
                exp.setApprovedBy(i % 2 == 0 ? "Admin" : null);
                expenseRepository.save(exp);
            }
            System.out.println("Seeded expenses.");
        }

        // 9. Seed Payslips
        if (payslipRepository.count() == 0) {
            for (int i = 0; i < 10; i++) {
                Employee emp = employees.get(i % employees.size());
                Payslip p = new Payslip();
                p.setEmployeeId(emp.getEmpId());
                p.setEmployeeName(emp.getName());
                p.setMonth("April");
                p.setYear(2024);
                p.setBaseSalary(Double.valueOf(emp.getSalary()));
                p.setDeductions(2000.0);
                p.setBonus(5000.0);
                p.setNetPay(p.getBaseSalary() - p.getDeductions() + p.getBonus());
                payslipRepository.save(p);
            }
            System.out.println("Seeded payslips.");
        }

        // 10. Seed Company Assets
        if (assetRepository.count() == 0) {
            String[] types = {"LAPTOP", "MONITOR", "PHONE", "KEYCARD"};
            for (int i = 0; i < 12; i++) {
                CompanyAsset asset = new CompanyAsset();
                asset.setAssetType(types[i % types.length]);
                asset.setSerialNumber("SN-XYZ-" + (1000 + i));
                if (i < 8) {
                    Employee emp = employees.get(i);
                    asset.setAssignedTo(emp.getEmpId());
                    asset.setAssignedName(emp.getName());
                }
                asset.setAssetCondition(i % 4 == 0 ? "NEW" : "GOOD");
                asset.setWarrantyExpiry(LocalDate.now().plusYears(1));
                assetRepository.save(asset);
            }
            System.out.println("Seeded company assets.");
        }

        // 11. Seed Recognitions
        if (recognitionRepository.count() == 0) {
            for (int i = 0; i < 8; i++) {
                Employee from = employees.get(i % employees.size());
                Employee to = employees.get((i + 1) % employees.size());
                Recognition rec = new Recognition();
                rec.setFromUser(from.getEmpId());
                rec.setFromName(from.getName());
                rec.setToUser(to.getEmpId());
                rec.setToName(to.getName());
                rec.setMessage("Great work on the project! 🚀");
                rec.setPoints(10 * (i + 1));
                recognitionRepository.save(rec);
            }
            System.out.println("Seeded recognition kudos.");
        }

        // 12. Seed Audit Logs
        if (auditLogRepository.count() == 0) {
            for (int i = 0; i < 15; i++) {
                AuditLog log = new AuditLog();
                log.setEntity(i % 2 == 0 ? "EMPLOYEE" : "DEPARTMENT");
                log.setEntityId("E10" + (i % 10));
                log.setAction(i % 3 == 0 ? "CREATE" : (i % 3 == 1 ? "UPDATE" : "DELETE"));
                log.setChangedBy("admin1");
                log.setNewValue("Sample modification data " + i);
                auditLogRepository.save(log);
            }
            System.out.println("Seeded audit logs.");
        }

        // 13. Seed Interns
        if (internRepository.count() == 0) {
            String[] names = {"Rahul", "Priya", "Amit", "Sonia", "Karan", "Deepika", "Ranveer", "Alia", "Sid", "Kiara"};
            for (int i = 0; i < names.length; i++) {
                internRepository.save(new Intern(null, names[i], names[i].toLowerCase() + "@intern.com", i % 2 == 0 ? "M" : "F", "2002-01-01", null, "Testing", 15000.0, "6 Months"));
            }
            System.out.println("Seeded interns.");
        }
    }
}
