package org.github.giliev.expensetracker.backend.services;

import org.github.giliev.expensetracker.backend.models.expenses.*;
import org.springframework.lang.Nullable;

import java.time.LocalDate;

public interface ExpenseService {
    PostExpenseResponse createExpense(String username, PostExpenseRequest expenseRequest);

    GetExpensesResponse getExpenses(String username, @Nullable LocalDate from, @Nullable LocalDate to);

    GetExpensesCategoryReportResponse getExpensesCategoryReport(String username,
                                                                @Nullable LocalDate from,
                                                                @Nullable LocalDate to);

    GetExpensesDailyReportResponse getExpensesDailyReport(String username);

    GetExpensesMonthlyReportResponse getExpensesMonthlyReport(String username);
}
