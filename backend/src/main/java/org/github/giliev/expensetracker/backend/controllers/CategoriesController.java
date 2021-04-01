package org.github.giliev.expensetracker.backend.controllers;

import io.swagger.v3.oas.annotations.Operation;
import org.github.giliev.expensetracker.backend.models.categories.*;
import org.github.giliev.expensetracker.backend.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/categories")
public class CategoriesController {
    private final CategoryService categoryService;

    @Autowired
    public CategoriesController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    @Operation(summary = "Get all categories", description = "Get all categories for the current user.")
    public GetCategoriesResponse getCategories(Principal principal) {
        return categoryService.getCategoriesByUsername(principal.getName());
    }

    @GetMapping("/{categoryId}")
    @Operation(summary = "Get category", description = "Get category information by category id.")
    @PreAuthorize("@auth.ownsCategory(authentication, #categoryId)")
    public GetCategoryResponse getCategoryById(@PathVariable Integer categoryId) {
        return categoryService.getCategoryById(categoryId);
    }

    @PostMapping
    @Operation(summary = "Create category", description = "Create a new category.")
    public PostCategoryResponse createCategory(@RequestBody PostCategoryRequest categoryRequest, Principal principal) {
        return categoryService.createCategory(categoryRequest, principal.getName());
    }

    @RequestMapping(path = "/{categoryId}", method = {RequestMethod.PATCH, RequestMethod.PUT})
    @Operation(summary = "Update category", description = "Update a category.")
    @PreAuthorize("@auth.ownsCategory(authentication, #categoryId)")
    public PatchCategoryResponse updateCategory(@PathVariable Integer categoryId,
                                                @RequestBody PatchCategoryRequest categoryRequest) {
        return categoryService.updateCategory(categoryId, categoryRequest);
    }

    @DeleteMapping("/{categoryId}")
    @Operation(summary = "Delete category", description = "Delete a category.")
    @PreAuthorize("@auth.ownsCategory(authentication, #categoryId)")
    public void deleteCategory(@PathVariable Integer categoryId) {
        categoryService.deleteCategory(categoryId);
    }
}
