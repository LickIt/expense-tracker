package org.github.giliev.expensetracker.backend.models.expenses;

import java.util.List;

public class GetExpensesMonthlyReportResponse {
    private Double thisMonthTotal;
    private List<MonthlyAverageReportItem> monthlyTrend;

    public Double getThisMonthTotal() {
        return thisMonthTotal;
    }

    public void setThisMonthTotal(Double thisMonthTotal) {
        this.thisMonthTotal = thisMonthTotal;
    }

    public List<MonthlyAverageReportItem> getMonthlyTrend() {
        return monthlyTrend;
    }

    public void setMonthlyTrend(List<MonthlyAverageReportItem> monthlyTrend) {
        this.monthlyTrend = monthlyTrend;
    }
}
