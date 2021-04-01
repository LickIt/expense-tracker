package org.github.giliev.expensetracker.backend.models.expenses;

public interface ExpenseCategoryReportItem {
    Integer getCategoryId();

    Double getAmount();

    Integer getCount();
}
