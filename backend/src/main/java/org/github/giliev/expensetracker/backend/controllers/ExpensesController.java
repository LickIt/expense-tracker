package org.github.giliev.expensetracker.backend.controllers;

import io.swagger.v3.oas.annotations.Operation;
import org.github.giliev.expensetracker.backend.models.expenses.*;
import org.github.giliev.expensetracker.backend.services.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/expenses")
public class ExpensesController {
    private final ExpenseService expenseService;

    @Autowired
    public ExpensesController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    @Operation(summary = "Create expense", description = "Create a new expense record.")
    @PreAuthorize("@auth.ownsCategory(authentication, #expenseRequest.categoryId)")
    public PostExpenseResponse createExpense(Principal principal, @RequestBody PostExpenseRequest expenseRequest) {
        return expenseService.createExpense(principal.getName(), expenseRequest);
    }

    @GetMapping
    @Operation(summary = "Get expenses", description = "Get expenses for a period of time.")
    public GetExpensesResponse getExpenses(Principal principal,
                                           @RequestParam(required = false) LocalDate from,
                                           @RequestParam(required = false) LocalDate to) {
        return expenseService.getExpenses(principal.getName(), from, to);
    }

    @GetMapping("/category-report")
    @Operation(summary = "Get expenses category report", description = "Get expenses by category.")
    public GetExpensesCategoryReportResponse getExpensesCategoryReport(Principal principal,
                                                                       @RequestParam(required = false) LocalDate from,
                                                                       @RequestParam(required = false) LocalDate to) {
        return expenseService.getExpensesCategoryReport(principal.getName(), from, to);
    }

    @GetMapping("/daily-report")
    @Operation(summary = "Get expenses daily report", description = "Get daily report of expenses")
    public GetExpensesDailyReportResponse getExpensesDailyReport(Principal principal) {
        return expenseService.getExpensesDailyReport(principal.getName());
    }

    @GetMapping("/monthly-report")
    @Operation(summary = "Get expenses monthly report", description = "Get monthly report of expenses")
    public GetExpensesMonthlyReportResponse getExpensesMonthlyReport(Principal principal) {
        return expenseService.getExpensesMonthlyReport(principal.getName());
    }

}
