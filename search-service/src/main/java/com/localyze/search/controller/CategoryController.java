package com.localyze.search.controller;

import com.localyze.common.dto.response.ApiResponse;
import com.localyze.common.dto.response.CategoryResponse;
import com.localyze.common.enums.Role;
import com.localyze.common.exception.UnauthorizedException;
import com.localyze.search.dto.CategoryRequest;
import com.localyze.search.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Endpoints for managing service categories")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get all categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Categories fetched successfully", categoryService.getAllCategories(), LocalDateTime.now()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Category fetched successfully", categoryService.getCategoryById(id), LocalDateTime.now()));
    }

    @PostMapping
    @Operation(summary = "Create a new category (Admin only)")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CategoryRequest request,
            @RequestHeader(value = "X-User-Role", required = false) String role) {
        
        if (!Role.ADMIN.name().equals(role)) {
            throw new UnauthorizedException("Only admins can create categories");
        }

        CategoryResponse response = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                true, "Category created successfully", response, LocalDateTime.now()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing category (Admin only)")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request,
            @RequestHeader(value = "X-User-Role", required = false) String role) {

        if (!Role.ADMIN.name().equals(role)) {
            throw new UnauthorizedException("Only admins can update categories");
        }

        CategoryResponse response = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Category updated successfully", response, LocalDateTime.now()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a category (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Role", required = false) String role) {

        if (!Role.ADMIN.name().equals(role)) {
            throw new UnauthorizedException("Only admins can delete categories");
        }

        categoryService.deleteCategory(id);
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Category deleted successfully", null, LocalDateTime.now()));
    }
}
