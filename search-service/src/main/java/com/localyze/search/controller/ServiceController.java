package com.localyze.search.controller;

import com.localyze.common.dto.response.ApiResponse;
import com.localyze.common.dto.response.PagedResponse;
import com.localyze.common.dto.response.ServiceResponse;
import com.localyze.common.exception.UnauthorizedException;
import com.localyze.common.enums.Role;
import com.localyze.search.dto.CreateServiceRequest;
import com.localyze.search.dto.UpdateServiceRequest;
import com.localyze.search.service.CloudinaryService;
import com.localyze.search.service.ServiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@Tag(name = "Services", description = "Endpoints for managing and searching services")
public class ServiceController {

    private final ServiceService serviceService;
    private final CloudinaryService cloudinaryService;

    @PostMapping
    @Operation(summary = "Create a new service")
    public ResponseEntity<ApiResponse<ServiceResponse>> createService(
            @Valid @RequestBody CreateServiceRequest request,
            @RequestHeader(value = "X-User-Id", required = true) Long providerId,
            @RequestHeader(value = "X-User-Email", required = false) String providerName) {
        
        ServiceResponse response = serviceService.createService(request, providerId, providerName != null ? providerName : "Provider");
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                true, "Service created successfully", response, LocalDateTime.now()));
    }

    @GetMapping
    @Operation(summary = "Get all services with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<ServiceResponse>>> getAllServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Services fetched successfully", serviceService.getAllServices(page, size), LocalDateTime.now()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get service by ID")
    public ResponseEntity<ApiResponse<ServiceResponse>> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Service fetched successfully", serviceService.getServiceById(id), LocalDateTime.now()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update service")
    public ResponseEntity<ApiResponse<ServiceResponse>> updateService(
            @PathVariable Long id,
            @Valid @RequestBody UpdateServiceRequest request,
            @RequestHeader(value = "X-User-Id", required = true) Long requesterId) {
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Service updated successfully", serviceService.updateService(id, request, requesterId), LocalDateTime.now()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a service")
    public ResponseEntity<ApiResponse<Void>> deleteService(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = true) Long requesterId,
            @RequestHeader(value = "X-User-Role", required = false) String role) {
        serviceService.deleteService(id, requesterId, role);
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Service deleted successfully", null, LocalDateTime.now()));
    }

    @GetMapping("/provider/{providerId}")
    @Operation(summary = "Get services by provider ID")
    public ResponseEntity<ApiResponse<PagedResponse<ServiceResponse>>> getServicesByProvider(
            @PathVariable Long providerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Services fetched successfully", serviceService.getServicesByProvider(providerId, page, size), LocalDateTime.now()));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get services by category ID")
    public ResponseEntity<ApiResponse<PagedResponse<ServiceResponse>>> getServicesByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Services fetched successfully", serviceService.getServicesByCategory(categoryId, page, size), LocalDateTime.now()));
    }

    @GetMapping("/search")
    @Operation(summary = "Search services by text query")
    public ResponseEntity<ApiResponse<PagedResponse<ServiceResponse>>> searchServices(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Services searched successfully", serviceService.searchServices(q, page, size), LocalDateTime.now()));
    }

    @GetMapping("/nearby")
    @Operation(summary = "Get nearby services")
    public ResponseEntity<ApiResponse<List<ServiceResponse>>> getNearbyServices(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "10.0") Double radius,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Nearby services fetched successfully", serviceService.getNearbyServices(lat, lng, radius, categoryId, page, size), LocalDateTime.now()));
    }

    @PostMapping("/{id}/images")
    @Operation(summary = "Upload image for a service")
    public ResponseEntity<ApiResponse<ServiceResponse>> addServiceImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "false") boolean isPrimary,
            @RequestHeader(value = "X-User-Id", required = true) Long requesterId,
            @RequestHeader(value = "X-User-Role", required = false) String role) {

        ServiceResponse service = serviceService.getServiceById(id);
        if (!service.getProviderId().equals(requesterId) && !Role.ADMIN.name().equals(role)) {
            throw new UnauthorizedException("You do not have permission to add images to this service");
        }

        Map<String, Object> uploadResult = cloudinaryService.uploadImage(file, "localyze/services");
        String imageUrl = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");

        ServiceResponse response = serviceService.addServiceImage(id, imageUrl, publicId, isPrimary);
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Image added successfully", response, LocalDateTime.now()));
    }

    @DeleteMapping("/{serviceId}/images/{imageId}")
    @Operation(summary = "Delete an image from a service")
    public ResponseEntity<ApiResponse<Void>> deleteServiceImage(
            @PathVariable Long serviceId,
            @PathVariable Long imageId,
            @RequestHeader(value = "X-User-Id", required = true) Long requesterId,
            @RequestHeader(value = "X-User-Role", required = false) String role) {

        ServiceResponse service = serviceService.getServiceById(serviceId);
        if (!service.getProviderId().equals(requesterId) && !Role.ADMIN.name().equals(role)) {
            throw new UnauthorizedException("You do not have permission to delete images from this service");
        }

        serviceService.deleteServiceImage(imageId, serviceId);
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Image deleted successfully", null, LocalDateTime.now()));
    }
}
