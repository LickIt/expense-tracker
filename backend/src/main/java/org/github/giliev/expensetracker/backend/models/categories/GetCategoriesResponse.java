package org.github.giliev.expensetracker.backend.models.categories;

import java.util.List;

public class GetCategoriesResponse {
    private List<GetCategoryResponse> categories;

    public GetCategoriesResponse() {
    }

    public GetCategoriesResponse(List<GetCategoryResponse> categories) {
        this.categories = categories;
    }

    public List<GetCategoryResponse> getCategories() {
        return categories;
    }

    public void setCategories(List<GetCategoryResponse> categories) {
        this.categories = categories;
    }
}
