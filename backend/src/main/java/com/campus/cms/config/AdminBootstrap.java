package com.campus.cms.config;

import com.campus.cms.model.Role;
import com.campus.cms.repository.UserRepository;
import com.campus.cms.service.AuthService;
import org.slf4j.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/** Creates the very first admin from environment variables, only when no admin exists yet.
 *  After that, admins are created by existing admins via POST /api/admin/users. */
@Component
public class AdminBootstrap implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);
    private final UserRepository users;
    private final AuthService auth;
    @Value("${app.bootstrap-admin.name:}") private String name;
    @Value("${app.bootstrap-admin.email:}") private String email;
    @Value("${app.bootstrap-admin.password:}") private String password;

    public AdminBootstrap(UserRepository users, AuthService auth) { this.users = users; this.auth = auth; }

    @Override
    public void run(String... args) {
        if (users.existsByRole(Role.ADMIN)) return;
        if (name.isBlank() || email.isBlank() || password.length() < 8) {
            log.warn("No admin exists and BOOTSTRAP_ADMIN_* env vars are not set (password >= 8 chars). No admin can log in yet.");
            return;
        }
        auth.saveAdmin(name, email.trim().toLowerCase(), password);
        log.info("Bootstrap admin created: {}", email);
    }
}
