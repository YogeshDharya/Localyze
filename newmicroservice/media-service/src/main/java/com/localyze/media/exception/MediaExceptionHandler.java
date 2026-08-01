package com.localyze.media.exception;

import com.localyze.common.dto.response.ApiResponse;
import com.localyze.common.exception.FileUploadException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@Slf4j
@RestControllerAdvice
public class MediaExceptionHandler {

    @ExceptionHandler(FileUploadException.class)
    public ResponseEntity<ApiResponse<Void>> handleFileUploadException(FileUploadException ex) {
        log.error("File upload error: {}", ex.getMessage(), ex);
        ApiResponse<Void> response = new ApiResponse<>(false, ex.getMessage(), null, LocalDateTime.now());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.error("Invalid argument error: {}", ex.getMessage(), ex);
        ApiResponse<Void> response = new ApiResponse<>(false, ex.getMessage(), null, LocalDateTime.now());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGlobalException(Exception ex) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        ApiResponse<Void> response = new ApiResponse<>(false, "An unexpected error occurred", null, LocalDateTime.now());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
