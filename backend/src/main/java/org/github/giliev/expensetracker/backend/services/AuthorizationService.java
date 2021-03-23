package org.github.giliev.expensetracker.backend.services;

import org.springframework.security.core.Authentication;

public interface AuthorizationService {
    boolean ownsCategory(Authentication authentication, Integer categoryId);
}
