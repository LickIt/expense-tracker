package org.github.giliev.expensetracker.backend.repositories;

import org.github.giliev.expensetracker.backend.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    boolean existsByIdAndUserId(Integer categoryId, UUID userId);

    List<Category> findAllByUserIdAndDeletedFalseOrderByName(UUID userId);
}
