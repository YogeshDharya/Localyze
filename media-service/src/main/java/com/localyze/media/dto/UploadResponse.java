package com.localyze.media.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@Builder 
@AllArgsConstructor 
@NoArgsConstructor
@Schema(description = "Upload Response")
public class UploadResponse {
    @Schema(description = "URL of the uploaded file")
    private String url;
    
    @Schema(description = "Public ID of the uploaded file")
    private String publicId;
    
    @Schema(description = "Format of the uploaded file")
    private String format;
    
    @Schema(description = "Size of the file in bytes")
    private long bytes;
    
    @Schema(description = "Width of the image")
    private int width;
    
    @Schema(description = "Height of the image")
    private int height;
    
    @Schema(description = "Resource type")
    private String resourceType;
}
