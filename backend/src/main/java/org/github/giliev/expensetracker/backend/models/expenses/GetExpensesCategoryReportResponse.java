package org.github.giliev.expensetracker.backend.models.expenses;

import java.util.List;

public class GetExpensesCategoryReportResponse {
    List<ExpenseCategoryReportItem> categories;

    public GetExpensesCategoryReportResponse() {
    }

    public GetExpensesCategoryReportResponse(List<ExpenseCategoryReportItem> categories) {
        this.categories = categories;
    }

    public List<ExpenseCategoryReportItem> getCategories() {
        return categories;
    }

    public void setCategories(List<ExpenseCategoryReportItem> categories) {
        this.categories = categories;
    }

}
