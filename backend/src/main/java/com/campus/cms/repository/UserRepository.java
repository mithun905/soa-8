package com.campus.cms.repository;

import com.campus.cms.model.Role;
import com.campus.cms.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByRollNumber(String rollNumber);
    boolean existsByRole(Role role);
}
