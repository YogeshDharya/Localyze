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

/**
 * Manages service category CRUD operations.
 * Categories use soft-delete via the isActive flag.
 */
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    /**
     * Retrieves all active categories.
     *
     * @return list of active category responses
     */
    public List<CategoryResponse> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrue().stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a category by its ID.
     *
     * @param id the category ID
     * @return the category response
     * @throws ResourceNotFoundException if no category exists with the given ID
     */
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return categoryMapper.toResponse(category);
    }

    /**
     * Creates a new category with a unique name.
     *
     * @param name        the category name
     * @param description the category description
     * @param iconUrl     the category icon URL
     * @return the created category response
     * @throws DuplicateResourceException if a category with the same name already exists
     */
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

    /**
     * Updates an existing category. Only non-null fields are updated.
     * Name uniqueness is enforced when changing the name.
     *
     * @param id          the category ID
     * @param name        the new name (nullable)
     * @param description the new description (nullable)
     * @param iconUrl     the new icon URL (nullable)
     * @return the updated category response
     * @throws ResourceNotFoundException  if the category does not exist
     * @throws DuplicateResourceException if the new name conflicts with an existing category
     */
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

    /**
     * Soft-deletes a category by setting isActive to false.
     *
     * @param id the category ID
     * @throws ResourceNotFoundException if the category does not exist
     */
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        category.setActive(false);
        categoryRepository.save(category);
    }
}
