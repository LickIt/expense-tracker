package org.github.giliev.expensetracker.backend.models.expenses;

import org.springframework.lang.Nullable;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

public class PostExpenseRequest {
    private Double amount;
    private LocalDateTime timestamp;
    private Integer categoryId;
    @Nullable
    private String notes;

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(OffsetDateTime timestamp) {
        this.timestamp = timestamp.toLocalDateTime();
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    @Nullable
    public String getNotes() {
        return notes;
    }

    public void setNotes(@Nullable String notes) {
        this.notes = notes;
    }
}
