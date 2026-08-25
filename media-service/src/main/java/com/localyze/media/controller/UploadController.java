package com.localyze.media.controller;

import com.localyze.common.dto.response.ApiResponse;
import com.localyze.media.dto.UploadResponse;
import com.localyze.media.service.CloudinaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Media Upload", description = "Endpoints for managing media uploads")
public class UploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping("/")
    @Operation(summary = "Generic file upload")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "localyze/general") String folder) {
        
        String url = cloudinaryService.uploadFile(file, folder);
        
        UploadResponse responseDto = UploadResponse.builder()
                .url(url)
                .publicId(cloudinaryService.extractPublicId(url))
                .build();
                
        ApiResponse<UploadResponse> response = ApiResponse.<UploadResponse>builder()
                .success(true)
                .message("File uploaded successfully")
                .data(responseDto)
                .timestamp(LocalDateTime.now())
                .build();
                
        return ResponseEntity.ok(response);
    }

    @PostMapping("/avatar")
    @Operation(summary = "Upload user avatar")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        
        Long userId = 0L;
        if (userIdHeader != null && !userIdHeader.isEmpty()) {
            try {
                userId = Long.parseLong(userIdHeader);
            } catch (NumberFormatException e) {
                log.warn("Invalid X-User-Id header: {}", userIdHeader);
            }
        }
        
        String url = cloudinaryService.uploadAvatar(file, userId);
        
        UploadResponse responseDto = UploadResponse.builder()
                .url(url)
                .publicId(cloudinaryService.extractPublicId(url))
                .build();
                
        ApiResponse<UploadResponse> response = ApiResponse.<UploadResponse>builder()
                .success(true)
                .message("Avatar uploaded successfully")
                .data(responseDto)
                .timestamp(LocalDateTime.now())
                .build();
                
        return ResponseEntity.ok(response);
    }

    @PostMapping("/service-image")
    @Operation(summary = "Upload service image")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadServiceImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("serviceId") Long serviceId) {
        
        String url = cloudinaryService.uploadServiceImage(file, serviceId);
        
        UploadResponse responseDto = UploadResponse.builder()
                .url(url)
                .publicId(cloudinaryService.extractPublicId(url))
                .build();
                
        ApiResponse<UploadResponse> response = ApiResponse.<UploadResponse>builder()
                .success(true)
                .message("Service image uploaded successfully")
                .data(responseDto)
                .timestamp(LocalDateTime.now())
                .build();
                
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/")
    @Operation(summary = "Delete file by public ID")
    public ResponseEntity<ApiResponse<String>> deleteFile(
            @RequestParam("publicId") String publicId) {
        
        cloudinaryService.deleteFile(publicId);
        
        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(true)
                .message("File deleted successfully")
                .data(publicId)
                .timestamp(LocalDateTime.now())
                .build();
                
        return ResponseEntity.ok(response);
    }
}
