package org.github.giliev.expensetracker.backend.models.expenses;

import org.springframework.lang.Nullable;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public class PostExpenseResponse {
    private Integer id;
    private Double amount;
    private LocalDateTime timestamp;
    private Integer categoryId;
    @Nullable
    private String notes;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public OffsetDateTime getTimestamp() {
        return timestamp.atOffset(ZoneOffset.UTC);
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
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
