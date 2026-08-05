package com.localyze.mapper;

import com.localyze.dto.response.CategoryResponse;
import com.localyze.entity.Category;
import org.springframework.stereotype.Component;

/**
 * Maps Category entity to CategoryResponse DTO.
 */
@Component
public class CategoryMapper {

    /**
     * Converts a Category entity to a CategoryResponse DTO.
     *
     * @param category the category entity
     * @return the category response DTO
     */
    public CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .iconUrl(category.getIconUrl())
                .isActive(category.isActive())
                .build();
    }
}
