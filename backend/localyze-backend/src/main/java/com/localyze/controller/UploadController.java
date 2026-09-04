package com.localyze.controller;

import com.localyze.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(cloudinaryService.uploadImage(file));
    }

    @PostMapping("/images")
    public ResponseEntity<List<Map<String, String>>> uploadImages(@RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(cloudinaryService.uploadImages(files));
    }

    @DeleteMapping("/image")
    public ResponseEntity<Map<String, String>> deleteImage(@RequestParam String publicId) {
        cloudinaryService.deleteImage(publicId);
        return ResponseEntity.ok(Map.of("message", "Image deleted successfully"));
    }
}
