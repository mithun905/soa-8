package com.campus.cms.controller;

import com.campus.cms.dto.*;
import com.campus.cms.model.User;
import com.campus.cms.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;
    public AuthController(AuthService auth) { this.auth = auth; }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest r) { return auth.registerStudent(r); }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest r) { return auth.login(r); }

    /** Current user (requires a valid JWT) */
    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal User user) { return UserResponse.from(user); }
}
