package org.github.giliev.expensetracker.backend.services;

import org.github.giliev.expensetracker.backend.entities.Category;
import org.github.giliev.expensetracker.backend.models.categories.*;
import org.github.giliev.expensetracker.backend.repositories.CategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static java.util.stream.Collectors.toList;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository, ModelMapper modelMapper) {
        this.categoryRepository = categoryRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public GetCategoriesResponse getCategoriesByUsername(String username) {
        UUID userId = UUID.fromString(username);
        List<Category> categories = categoryRepository.findAllByUserIdAndDeletedFalseOrderByName(userId);
        return new GetCategoriesResponse(
                categories.stream()
                          .map(c -> modelMapper.map(c, GetCategoryResponse.class))
                          .collect(toList())
        );
    }

    @Override
    public GetCategoryResponse getCategoryById(Integer categoryId) {
        Optional<Category> category = categoryRepository.findById(categoryId);
        return modelMapper.map(category.orElseThrow(), GetCategoryResponse.class);
    }

    @Override
    public PostCategoryResponse createCategory(PostCategoryRequest categoryRequest, String username) {
        Category category = modelMapper.map(categoryRequest, Category.class);
        category.setUserId(UUID.fromString(username));
        categoryRepository.save(category);

        return modelMapper.map(category, PostCategoryResponse.class);
    }

    @Override
    public PatchCategoryResponse updateCategory(Integer categoryId, PatchCategoryRequest categoryRequest) {
        Category category = categoryRepository.findById(categoryId).orElseThrow();

        if (categoryRequest.getName() != null) {
            category.setName(categoryRequest.getName());
        }
        if (categoryRequest.getColor() != null) {
            category.setColor(categoryRequest.getColor());
        }

        categoryRepository.save(category);
        return modelMapper.map(category, PatchCategoryResponse.class);
    }

    @Override
    public boolean doesUserOwnCategory(String username, Integer categoryId) {
        UUID userId = UUID.fromString(username);
        return categoryRepository.existsByIdAndUserId(categoryId, userId);
    }

    @Override
    public void deleteCategory(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow();
        category.setDeleted(true);
        categoryRepository.save(category);
    }
}
