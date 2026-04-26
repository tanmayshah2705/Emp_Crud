package com.example.emp_crud.controllers;

import com.example.emp_crud.models.User;
import com.example.emp_crud.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "username", username,
                "name", user.get().getName(),
                "role", user.get().getRole(),
                "employeeId", user.get().getEmployeeId() != null ? user.get().getEmployeeId() : ""
            ));
        }
        return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid credentials"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Username already exists"));
        }
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("EMPLOYEE");
        }
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("success", true, "message", "User registered successfully"));
    }
}
