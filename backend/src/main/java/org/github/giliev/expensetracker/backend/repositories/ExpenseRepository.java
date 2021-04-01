package org.github.giliev.expensetracker.backend.repositories;

import org.github.giliev.expensetracker.backend.entities.Expense;
import org.github.giliev.expensetracker.backend.models.expenses.ExpenseCategoryReportItem;
import org.github.giliev.expensetracker.backend.models.expenses.MonthlyAverageReportItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Integer>, JpaSpecificationExecutor<Expense> {
    @Query("select e.category.id as categoryId, sum(e.amount) as amount, count(e.id) as count " +
            "from Expense e " +
            "where e.userId = :userId and e.timestamp >= :from and e.timestamp <= :to " +
            "group by e.category")
    List<ExpenseCategoryReportItem> getCategoryReport(UUID userId, LocalDateTime from, LocalDateTime to);

    @Query("select count(e) from Expense e where e.userId = :userId and e.timestamp >= :from")
    Integer getExpensesCount(UUID userId, LocalDateTime from);

    @Query("select sum(e.amount) from Expense e where e.userId = :userId and e.timestamp >= :from")
    Double getTotalAmount(UUID userId, LocalDateTime from);

    @Query("select e.amount from Expense e where e.userId = :userId and e.timestamp >= :from order by e.amount")
    Stream<Float> getMedianAmount(UUID userId, LocalDateTime from);

    @Query(value = "select extract(month from e.timestamp) as month, sum(e.amount) as value " +
            "from expense e " +
            "where e.user_id = :userId and e.timestamp >= :from " +
            "group by month " +
            "order by month desc " +
            "limit 5",
            nativeQuery = true)
    List<MonthlyAverageReportItem> getMonthlyAverage(UUID userId, LocalDateTime from);
}
