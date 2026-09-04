package com.localyze.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.localyze.exception.FileUploadException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @SuppressWarnings("unchecked")
    public Map<String, String> uploadImage(MultipartFile file) {
        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "localyze",
                            "resource_type", "image",
                            "quality", "auto",
                            "fetch_format", "auto"
                    ));
            
            return Map.of(
                    "url", (String) uploadResult.get("secure_url"),
                    "publicId", (String) uploadResult.get("public_id")
            );
        } catch (IOException e) {
            throw new FileUploadException("Failed to upload image: " + e.getMessage());
        }
    }


    public List<Map<String, String>> uploadImages(List<MultipartFile> files) {
        if (files.size() > 5) {
            throw new FileUploadException("Maximum 5 images allowed");
        }
        List<Map<String, String>> results = new ArrayList<>();
        for (MultipartFile file : files) {
            results.add(uploadImage(file));
        }
        return results;
    }

    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new FileUploadException("Failed to delete image: " + e.getMessage());
        }
    }
}
