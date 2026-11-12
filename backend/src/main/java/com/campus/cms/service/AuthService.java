package com.campus.cms.service;

import com.campus.cms.dto.*;
import com.campus.cms.exception.ApiException;
import com.campus.cms.model.*;
import com.campus.cms.repository.UserRepository;
import com.campus.cms.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users; this.encoder = encoder; this.jwt = jwt;
    }

    /** Public registration: ALWAYS creates a STUDENT. */
    public AuthResponse registerStudent(RegisterRequest r) {
        String email = r.email().trim().toLowerCase();
        String roll = r.rollNumber().trim().toUpperCase();
        if (users.existsByEmail(email)) throw new ApiException(HttpStatus.CONFLICT, "Email is already registered");
        if (users.existsByRollNumber(roll)) throw new ApiException(HttpStatus.CONFLICT, "Roll number is already registered");

        User u = new User();
        u.setName(r.name().trim());
        u.setEmail(email);
        u.setPassword(encoder.encode(r.password()));
        u.setRollNumber(roll);
        u.setRole(Role.STUDENT);
        u.setCreatedAt(Instant.now());
        u = users.save(u);
        return new AuthResponse(jwt.generate(u), UserResponse.from(u));
    }

    /** Admin creation: only reachable by an authenticated ADMIN (see AdminUserController). */
    public UserResponse createAdmin(CreateAdminRequest r) {
        String email = r.email().trim().toLowerCase();
        if (users.existsByEmail(email)) throw new ApiException(HttpStatus.CONFLICT, "Email is already registered");
        return UserResponse.from(saveAdmin(r.name(), email, r.password()));
    }

    public User saveAdmin(String name, String email, String rawPassword) {
        User u = new User();
        u.setName(name.trim());
        u.setEmail(email);
        u.setPassword(encoder.encode(rawPassword));
        u.setRole(Role.ADMIN); // rollNumber intentionally left null
        u.setCreatedAt(Instant.now());
        return users.save(u);
    }

    public AuthResponse login(LoginRequest r) {
        User u = users.findByEmail(r.email().trim().toLowerCase()).orElse(null);
        // same generic message for unknown email / wrong password / wrong portal
        if (u == null || !encoder.matches(r.password(), u.getPassword()) || u.getRole() != r.portal()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password for this login type");
        }
        return new AuthResponse(jwt.generate(u), UserResponse.from(u));
    }
}
