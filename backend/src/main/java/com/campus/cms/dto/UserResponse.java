package com.campus.cms.dto;

import com.campus.cms.model.Role;
import com.campus.cms.model.User;

import java.time.Instant;

public record UserResponse(String id, String name, String email, String rollNumber, Role role, Instant createdAt) {
    public static UserResponse from(User u) {
        return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRollNumber(), u.getRole(), u.getCreatedAt());
    }
}
