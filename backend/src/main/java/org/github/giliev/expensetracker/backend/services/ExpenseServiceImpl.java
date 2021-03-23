package org.github.giliev.expensetracker.backend.services;

import org.github.giliev.expensetracker.backend.entities.Category;
import org.github.giliev.expensetracker.backend.entities.Expense;
import org.github.giliev.expensetracker.backend.models.expenses.*;
import org.github.giliev.expensetracker.backend.repositories.CategoryRepository;
import org.github.giliev.expensetracker.backend.repositories.ExpenseRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static java.util.stream.Collectors.toList;
import static org.springframework.data.domain.Sort.Direction.DESC;

@Service
@Transactional
public class ExpenseServiceImpl implements ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final ModelMapper modelMapper;
    private final CategoryRepository categoryRepository;

    @Autowired
    public ExpenseServiceImpl(ExpenseRepository expenseRepository,
                              ModelMapper modelMapper,
                              CategoryRepository categoryRepository) {
        this.expenseRepository = expenseRepository;
        this.modelMapper = modelMapper;
        this.categoryRepository = categoryRepository;
    }

    private static Specification<Expense> getFromSpecification(LocalDateTime from) {
        return (Root<Expense> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("timestamp"), from);
    }

    private static Specification<Expense> getToSpecification(LocalDateTime to) {
        return (Root<Expense> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("timestamp"), to);
    }

    private static Specification<Expense> getUserSpecification(String username) {
        return (Root<Expense> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) ->
                criteriaBuilder.equal(root.get("userId"), UUID.fromString(username));
    }

    private static Specification<Expense> getUserAndPeriodSpecification(String username,
                                                                        @Nullable LocalDate from,
                                                                        @Nullable LocalDate to) {
        Specification<Expense> spec = getUserSpecification(username);
        if (from != null) {
            spec = spec.and(getFromSpecification(from.atStartOfDay()));
        }
        if (to != null) {
            spec = spec.and(getToSpecification(to.atStartOfDay()));
        }

        return spec;
    }

    @Override
    public PostExpenseResponse createExpense(String username, PostExpenseRequest expenseRequest) {
        Category category = categoryRepository.findById(expenseRequest.getCategoryId()).orElseThrow();
        Expense expense = modelMapper.map(expenseRequest, Expense.class);
        expense.setUserId(UUID.fromString(username));
        expense.setCategory(category);
        expenseRepository.save(expense);

        return modelMapper.map(expense, PostExpenseResponse.class);
    }

    @Override
    public GetExpensesResponse getExpenses(String username, @Nullable LocalDate from, @Nullable LocalDate to) {
        Specification<Expense> specification = getUserAndPeriodSpecification(username, from, to);
        List<Expense> expenses = expenseRepository.findAll(specification, Sort.by(DESC, "id"));

        return new GetExpensesResponse(expenses.stream()
                                               .map(e -> modelMapper.map(e, GetExpenseResponse.class))
                                               .collect(toList()));
    }

    @Override
    public GetExpensesCategoryReportResponse getExpensesCategoryReport(String username,
                                                                       @Nullable LocalDate from,
                                                                       @Nullable LocalDate to) {
        LocalDateTime fromDateTime = Optional.ofNullable(from).orElse(LocalDate.EPOCH).atStartOfDay();
        LocalDateTime toDateTime = Optional.ofNullable(to).orElse(LocalDate.of(9999, 1, 1)).atStartOfDay();

        List<ExpenseCategoryReportItem> categoryItems =
                expenseRepository.getCategoryReport(UUID.fromString(username), fromDateTime, toDateTime);

        return new GetExpensesCategoryReportResponse(categoryItems);
    }

    @Override
    public GetExpensesDailyReportResponse getExpensesDailyReport(String username) {
        LocalDateTime from = LocalDate.now().minusDays(30).atStartOfDay();
        UUID userId = UUID.fromString(username);

        Integer count = expenseRepository.getExpensesCount(userId, from);
        Double totalAmount = expenseRepository.getTotalAmount(userId, from);
        Double mean = totalAmount / count;

        double median = expenseRepository.getMedianAmount(userId, from)
                                         .skip(count / 2)
                                         .limit(count % 2 == 1 ? 1 : 2)
                                         .map(Float::doubleValue)
                                         .mapToDouble(a -> a)
                                         .average()
                                         .orElse(0);

        List<ExpenseCategoryReportItem> categoryReport =
                expenseRepository.getCategoryReport(userId, from, LocalDateTime.now());

        List<GetExpensesDailyReportResponse.CategoryGroupItem> topCategories =
                categoryReport.stream()
                              .sorted(Comparator.comparing(ExpenseCategoryReportItem::getAmount).reversed())
                              .limit(5)
                              .map(this::getCategoryGroupItem)
                              .collect(toList());

        GetExpensesDailyReportResponse result = new GetExpensesDailyReportResponse();
        result.setMean(mean);
        result.setMedian(median);
        result.setTopCategories(topCategories);

        return result;
    }

    private GetExpensesDailyReportResponse.CategoryGroupItem getCategoryGroupItem(ExpenseCategoryReportItem reportItem) {
        double dailyAmount = reportItem.getAmount() / 30;
        dailyAmount = (double) Math.round(dailyAmount * 100) / 100;

        return new GetExpensesDailyReportResponse.CategoryGroupItem(reportItem.getCategoryId(), dailyAmount);
    }

    @Override
    public GetExpensesMonthlyReportResponse getExpensesMonthlyReport(String username) {
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime fiveMonthsPrior = startOfMonth.minusMonths(5);
        UUID userId = UUID.fromString(username);

        Double totalAmount = expenseRepository.getTotalAmount(userId, startOfMonth);
        List<MonthlyAverageReportItem> monthlyAverage = expenseRepository.getMonthlyAverage(userId, fiveMonthsPrior);

        GetExpensesMonthlyReportResponse result = new GetExpensesMonthlyReportResponse();
        result.setThisMonthTotal(totalAmount);
        result.setMonthlyTrend(monthlyAverage);

        return result;
    }

}
