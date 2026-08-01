package com.localyze.user.client;

import com.localyze.common.dto.response.ApiResponse;
import com.localyze.common.dto.response.ServiceResponse;
import com.localyze.user.dto.RatingUpdateRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "search-service", path = "/internal/services")
public interface SearchServiceClient {
    @GetMapping("/{id}/exists")
    ApiResponse<Boolean> checkServiceExists(@PathVariable("id") Long id);
    
    @PatchMapping("/{id}/rating")
    ApiResponse<ServiceResponse> updateServiceRating(@PathVariable("id") Long id, @RequestBody RatingUpdateRequest request);
    
    @GetMapping("/{id}")
    ApiResponse<ServiceResponse> getService(@PathVariable("id") Long id);
}
