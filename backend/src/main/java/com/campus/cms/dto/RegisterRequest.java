package com.campus.cms.dto;

import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank @Size(min = 2, max = 100) String name,
        @NotBlank @Email @Size(max = 150) String email,
        @NotBlank @Size(min = 8, max = 72)
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", message = "Password must contain at least one letter and one digit")
        String password,
        @NotBlank @Size(max = 30) @Pattern(regexp = "^[A-Za-z0-9\\-_/]+$", message = "Roll number may contain letters, digits, - _ /")
        String rollNumber) {}
