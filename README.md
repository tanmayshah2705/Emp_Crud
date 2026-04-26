# HRMS Pro - Enterprise Human Resource Management System

HRMS Pro is a comprehensive, full-stack Human Resource Management System built to handle the complexities of modern workforce management. From recruitment to retirement, it provides a seamless experience for Admins, HR Managers, and Employees.

## 🚀 Key Features

The system is composed of 16 integrated functional modules:

### 1. Core HR & Workforce
*   **Role-Based Access Control (RBAC)**: Secure access for Super Admins, HR Managers, and Employees.
*   **Employee Management**: Full CRUD for employee profiles with city/state/department links.
*   **Intern Management**: Specialized tracking for internship programs.
*   **Master Data Management**: Centralized control over States, Cities, and Departments.

### 2. Time & Attendance
*   **Real-time Attendance**: One-click Clock-In/Clock-Out with automated hour calculation.
*   **Attendance Trends**: Visual bar charts for individual employee performance tracking.
*   **Leave Management**: Comprehensive workflow for leave applications, reasons, and approvals.

### 3. Finance & Payroll
*   **Automated Payroll**: Salary calculation with automatic attendance-based deductions.
*   **Expense Tracking**: Categorized expense claims (Travel, Meals, etc.) with approval workflows.
*   **Digital Payslips**: Monthly payslip generation and employee-side viewing.

### 4. Enterprise Assets & Security
*   **Asset Management**: Inventory tracking for IT assets (Laptops, Monitors, etc.) assigned to staff.
*   **Audit Trails**: Detailed logs of every system action (Create, Update, Delete) for compliance.
*   **Bulk Data Operations**: CSV-based bulk upload for rapidly seeding employee data.

### 5. Engagement & Analytics
*   **Recognition Wall**: Peer-to-peer kudos system with points to boost company culture.
*   **Real-time Notifications**: Instant alerts for leave requests, approvals, and recognitions.
*   **Advanced Dashboard**: High-level statistics cards for immediate organizational insight.

---

## 🛠 Tech Stack

### Backend
*   **Framework**: Java Spring Boot 3.2.5
*   **Database**: MySQL
*   **ORM**: Spring Data JPA / Hibernate
*   **Security**: Custom Role-Based Authentication
*   **Build Tool**: Maven

### Frontend
*   **Library**: React 18
*   **Build Tool**: Vite
*   **Styling**: Vanilla CSS (Premium Glassmorphism Design)
*   **Charts**: Recharts
*   **Routing**: React Router v6

---

## 📦 Setup & Installation

### Prerequisites
*   Java 21 or higher
*   Node.js 18 or higher
*   MySQL Server

### Backend Setup
1. Navigate to the `backend` folder.
2. Update `src/main/resources/application.properties` with your MySQL credentials.
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
4. The backend will automatically seed initial demo data on the first run.

### Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and set your API URL:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔐 Default Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin1` | `admin123` |
| **HR Manager** | `hr1` | `hr123` |
| **Employee** | `e100` | `pass123` |

---

## 🌐 Deployment Note
The project is configured for a hybrid deployment:
*   **Frontend**: Hosted on Vercel.
*   **Backend**: Hosted locally and exposed via **ngrok** tunnel.
*   **CORS**: Configured to allow cross-origin requests from any source for flexible tunneling.
