package com.campus.cms.controller;

import com.campus.cms.dto.*;
import com.campus.cms.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/** Protected by SecurityConfig: /api/admin/** requires ROLE_ADMIN */
@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {
    private final AuthService auth;
    public AdminUserController(AuthService auth) { this.auth = auth; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createAdmin(@Valid @RequestBody CreateAdminRequest r) { return auth.createAdmin(r); }
}
