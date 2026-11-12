package com.campus.cms.dto;

import com.campus.cms.model.Role;
import jakarta.validation.constraints.*;

/** portal = which login page was used (STUDENT or ADMIN). It is only used to reject
 *  logins on the wrong portal; the real role always comes from the database. */
public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password,
        @NotNull Role portal) {}
