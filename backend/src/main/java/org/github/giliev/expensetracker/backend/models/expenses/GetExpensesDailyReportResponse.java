package org.github.giliev.expensetracker.backend.models.expenses;

import java.util.List;

public class GetExpensesDailyReportResponse {
    private Double mean;
    private Double median;
    private List<CategoryGroupItem> topCategories;

    public Double getMean() {
        return mean;
    }

    public void setMean(Double mean) {
        this.mean = mean;
    }

    public Double getMedian() {
        return median;
    }

    public void setMedian(Double median) {
        this.median = median;
    }

    public List<CategoryGroupItem> getTopCategories() {
        return topCategories;
    }

    public void setTopCategories(List<CategoryGroupItem> topCategories) {
        this.topCategories = topCategories;
    }

    public static class CategoryGroupItem {
        private Integer categoryId;
        private Double value;

        public CategoryGroupItem() {
        }

        public CategoryGroupItem(Integer categoryId, Double value) {
            this.categoryId = categoryId;
            this.value = value;
        }

        public Integer getCategoryId() {
            return categoryId;
        }

        public void setCategoryId(Integer categoryId) {
            this.categoryId = categoryId;
        }

        public Double getValue() {
            return value;
        }

        public void setValue(Double value) {
            this.value = value;
        }
    }
}
