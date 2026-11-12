
package com.campus.cms.exception;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.Instant;
import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private ResponseEntity<Map<String, Object>> body(
            HttpStatus status, String message,
            Map<String, String> fields) {

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("timestamp", Instant.now().toString());
        response.put("status", status.value());
        response.put("message", message);

        if (fields != null) {
            response.put("fieldErrors", fields);
        }

        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Map<String, Object>> api(ApiException e) {
        return body(e.getStatus(), e.getMessage(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validation(
            MethodArgumentNotValidException e) {

        Map<String, String> fields = new LinkedHashMap<>();

        e.getBindingResult().getFieldErrors().forEach(
            error -> fields.putIfAbsent(
                error.getField(), error.getDefaultMessage()
            )
        );

        return body(HttpStatus.BAD_REQUEST, "Validation failed", fields);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> badRequest(
            IllegalArgumentException e) {

        return body(HttpStatus.BAD_REQUEST, e.getMessage(), null);
    }

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<Map<String, Object>> duplicate(
            DuplicateKeyException e) {

        return body(
            HttpStatus.CONFLICT,
            "Email or roll number already registered",
            null
        );
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> fileSize(
            MaxUploadSizeExceededException e) {

        return body(
            HttpStatus.PAYLOAD_TOO_LARGE,
            "File too large (maximum 5MB)",
            null
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> other(Exception e) {
        e.printStackTrace();

        return body(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong",
            null
        );
    }
}
