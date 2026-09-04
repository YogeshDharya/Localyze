package com.localyze.service;

import com.localyze.dto.response.CategoryResponse;
import com.localyze.entity.Category;
import com.localyze.exception.DuplicateResourceException;
import com.localyze.exception.ResourceNotFoundException;
import com.localyze.mapper.CategoryMapper;
import com.localyze.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public List<CategoryResponse> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrue().stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return categoryMapper.toResponse(category);
    }

    @Transactional
    public CategoryResponse createCategory(String name, String description, String iconUrl) {
        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new DuplicateResourceException("Category with name '" + name + "' already exists");
        }
        Category category = Category.builder()
                .name(name)
                .description(description)
                .iconUrl(iconUrl)
                .isActive(true)
                .build();
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, String name, String description, String iconUrl) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        if (name != null && !name.equalsIgnoreCase(category.getName())) {
            if (categoryRepository.existsByNameIgnoreCase(name)) {
                throw new DuplicateResourceException("Category with name '" + name + "' already exists");
            }
            category.setName(name);
        }
        if (description != null) category.setDescription(description);
        if (iconUrl != null) category.setIconUrl(iconUrl);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }


    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        category.setActive(false);
        categoryRepository.save(category);
    }
}
