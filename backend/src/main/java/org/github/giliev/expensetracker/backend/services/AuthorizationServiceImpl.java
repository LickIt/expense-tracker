package org.github.giliev.expensetracker.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service("auth")
public class AuthorizationServiceImpl implements AuthorizationService {
    private final CategoryService categoryService;

    @Autowired
    public AuthorizationServiceImpl(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Override
    public boolean ownsCategory(Authentication authentication, Integer categoryId) {
        String username = authentication.getName();
        return categoryService.doesUserOwnCategory(username, categoryId);
    }
}
