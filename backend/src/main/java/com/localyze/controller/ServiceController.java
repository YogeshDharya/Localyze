package com.localyze.controller;

import com.localyze.dto.request.ServiceRequest;
import com.localyze.dto.response.PagedResponse;
import com.localyze.dto.response.ServiceResponse;
import com.localyze.service.ServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;


    @GetMapping
    public ResponseEntity<PagedResponse<ServiceResponse>> getServices(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(serviceService.getAllServices(
                categoryId, search, minPrice, maxPrice, minRating, sortBy, sortDir, page, size));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<ServiceResponse>> getNearbyServices(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "1.0") double radius,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "distance") String sortBy) {
        return ResponseEntity.ok(serviceService.getNearbyServices(
                lat, lng, radius, categoryId, minPrice, maxPrice, minRating, sortBy));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> getService(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.getServiceById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<ServiceResponse> createService(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ServiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(serviceService.createService(userDetails.getUsername(), request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<ServiceResponse> updateService(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ServiceRequest request) {
        return ResponseEntity.ok(serviceService.updateService(id, userDetails.getUsername(), request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteService(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        serviceService.deleteService(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<PagedResponse<ServiceResponse>> getMyServices(
    		
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
    	
    		System.out.println("services/my reached");
        return ResponseEntity.ok(serviceService.getMyServices(userDetails.getUsername(), page, size));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<PagedResponse<ServiceResponse>> getSellerServices(
            @PathVariable Long sellerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(serviceService.getSellerServices(sellerId, page, size));
    }

}
