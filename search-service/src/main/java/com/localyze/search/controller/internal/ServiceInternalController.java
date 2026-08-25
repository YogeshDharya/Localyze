package com.localyze.search.controller.internal;

import com.localyze.common.dto.response.ApiResponse;
import com.localyze.search.dto.RatingUpdateRequest;
import com.localyze.search.service.ServiceService;
import io.swagger.v3.oas.annotations.Hidden;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/internal/services")
@RequiredArgsConstructor
@Hidden // Hide internal endpoints from public swagger
public class ServiceInternalController {

    private final ServiceService serviceService;

    @GetMapping("/{id}/exists")
    public ResponseEntity<ApiResponse<Boolean>> checkServiceExists(@PathVariable Long id) {
        boolean exists = true;
        try {
            serviceService.getServiceById(id);
        } catch (Exception e) {
            exists = false;
        }
        
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Service existence checked", exists, LocalDateTime.now()));
    }

    @PatchMapping("/{id}/rating")
    public ResponseEntity<ApiResponse<Void>> updateServiceRating(
            @PathVariable Long id,
            @Valid @RequestBody RatingUpdateRequest request) {
        
        serviceService.updateRating(id, request);
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Service rating updated successfully", null, LocalDateTime.now()));
    }
}
