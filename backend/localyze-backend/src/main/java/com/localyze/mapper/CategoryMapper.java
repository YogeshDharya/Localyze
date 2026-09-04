package com.localyze.mapper;

import com.localyze.dto.response.CategoryResponse;
import com.localyze.entity.Category;
import org.springframework.stereotype.Component;


@Component
public class CategoryMapper {


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
