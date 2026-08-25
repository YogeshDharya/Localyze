package com.localyze.search.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.localyze.common.exception.FileUploadException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public Map<String, Object> uploadImage(MultipartFile file, String folder) {
        try {
            return cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", folder,
                    "public_id", UUID.randomUUID().toString()
            ));
        } catch (IOException e) {
            log.error("Failed to upload image to Cloudinary", e);
            throw new FileUploadException("Failed to upload image");
        }
    }

    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            log.error("Failed to delete image from Cloudinary for publicId: {}", publicId, e);
            throw new FileUploadException("Failed to delete image");
        }
    }
    
    public String extractPublicId(String url) {
        if (url == null || !url.contains("/")) {
            return null;
        }
        String[] parts = url.split("/");
        String lastPart = parts[parts.length - 1];
        int dotIndex = lastPart.lastIndexOf('.');
        if (dotIndex != -1) {
            return lastPart.substring(0, dotIndex);
        }
        return lastPart;
    }
}
