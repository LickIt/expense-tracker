package org.github.giliev.expensetracker.backend.models.expenses;

import java.util.List;

public class GetExpensesResponse {
    private List<GetExpenseResponse> expenses;

    public GetExpensesResponse() {
    }

    public GetExpensesResponse(List<GetExpenseResponse> expenses) {
        this.expenses = expenses;
    }

    public List<GetExpenseResponse> getExpenses() {
        return expenses;
    }

    public void setExpenses(List<GetExpenseResponse> expenses) {
        this.expenses = expenses;
    }
}
