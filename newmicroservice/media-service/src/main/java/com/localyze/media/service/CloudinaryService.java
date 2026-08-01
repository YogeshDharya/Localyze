package com.localyze.media.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.localyze.common.exception.FileUploadException;
import com.localyze.media.dto.UploadResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file, String folder) {
        try {
            Map<?, ?> options = ObjectUtils.asMap("folder", folder);
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
            log.info("File uploaded successfully to folder: {}", folder);
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            log.error("Error uploading file to Cloudinary", e);
            throw new FileUploadException("Failed to upload file to Cloudinary: " + e.getMessage());
        }
    }

    public String uploadAvatar(MultipartFile file, Long userId) {
        try {
            Map<?, ?> options = ObjectUtils.asMap(
                    "folder", "localyze/avatars",
                    "public_id", "user_" + userId,
                    "transformation", "c_fill,h_300,w_300,g_face"
            );
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
            log.info("Avatar uploaded successfully for user: {}", userId);
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            log.error("Error uploading avatar to Cloudinary", e);
            throw new FileUploadException("Failed to upload avatar: " + e.getMessage());
        }
    }

    public String uploadServiceImage(MultipartFile file, Long serviceId) {
        try {
            Map<?, ?> options = ObjectUtils.asMap(
                    "folder", "localyze/services",
                    "public_id", "service_" + serviceId + "_" + System.currentTimeMillis()
            );
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
            log.info("Service image uploaded successfully for service: {}", serviceId);
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            log.error("Error uploading service image to Cloudinary", e);
            throw new FileUploadException("Failed to upload service image: " + e.getMessage());
        }
    }

    public void deleteFile(String publicId) {
        try {
            Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("File deleted successfully, publicId: {}, result: {}", publicId, result.get("result"));
        } catch (IOException e) {
            log.error("Error deleting file from Cloudinary", e);
            throw new FileUploadException("Failed to delete file from Cloudinary: " + e.getMessage());
        }
    }

    public String extractPublicId(String cloudinaryUrl) {
        if (cloudinaryUrl == null || cloudinaryUrl.trim().isEmpty()) {
            return null;
        }
        
        try {
            // Pattern to match Cloudinary URL and extract version + public_id
            // Example: https://res.cloudinary.com/demo/image/upload/v1570979139/folder/image.jpg
            Pattern pattern = Pattern.compile(".*/upload/(?:v\\d+/)?(.*)\\.[a-zA-Z]+$");
            Matcher matcher = pattern.matcher(cloudinaryUrl);
            
            if (matcher.matches()) {
                return matcher.group(1);
            }
            return null;
        } catch (Exception e) {
            log.error("Error extracting public ID from URL: {}", cloudinaryUrl, e);
            return null;
        }
    }
}
