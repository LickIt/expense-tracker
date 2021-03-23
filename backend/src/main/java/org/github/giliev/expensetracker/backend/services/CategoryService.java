package org.github.giliev.expensetracker.backend.services;

import org.github.giliev.expensetracker.backend.models.categories.*;

public interface CategoryService {
    GetCategoriesResponse getCategoriesByUsername(String username);

    GetCategoryResponse getCategoryById(Integer categoryId);

    PostCategoryResponse createCategory(PostCategoryRequest categoryRequest, String username);

    PatchCategoryResponse updateCategory(Integer categoryId, PatchCategoryRequest categoryRequest);

    boolean doesUserOwnCategory(String username, Integer categoryId);

    void deleteCategory(Integer categoryId);
}
