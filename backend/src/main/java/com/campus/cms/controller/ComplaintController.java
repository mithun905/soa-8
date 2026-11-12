
package com.campus.cms.controller;

import com.campus.cms.model.Complaint;
import com.campus.cms.model.User;
import com.campus.cms.service.ComplaintService;

import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class ComplaintController {

    private final ComplaintService service;

    public ComplaintController(ComplaintService service) {
        this.service = service;
    }

    private String imageToBase64(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Image must be below 5MB");
        }

        String type = file.getContentType();

        if (type == null || !Set.of(
                "image/jpeg", "image/png", "image/webp"
        ).contains(type)) {
            throw new IllegalArgumentException(
                    "Only JPG, PNG and WEBP images are allowed");
        }

        return "data:" + type + ";base64,"
                + Base64.getEncoder().encodeToString(file.getBytes());
    }

    // STUDENT: Submit complaint
    @PostMapping(value = "/student/complaints",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Complaint createComplaint(
            @AuthenticationPrincipal User student,
            @RequestParam String category,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile photo
    ) throws IOException {

        if (student == null) {
            throw new IllegalArgumentException("Student authentication required");
        }

        if (!Set.of("Electrical", "Carpenter", "Plumber", "Others")
                .contains(category)) {
            throw new IllegalArgumentException("Invalid complaint category");
        }

        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException("Description is required");
        }

        return service.createComplaint(
                student, category, description.trim(), imageToBase64(photo));
    }

    // STUDENT: View own complaints
    @GetMapping("/student/complaints")
    public List<Complaint> getStudentComplaints(
            @AuthenticationPrincipal User student) {

        return service.getStudentComplaints(student.getId());
    }

    // ADMIN: View all complaints
    @GetMapping("/admin/complaints")
    public List<Complaint> getAllComplaints() {
        return service.getAllComplaints();
    }

    // ADMIN: Update status and completion proof
    @PatchMapping(value = "/admin/complaints/{id}/status",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Complaint updateStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) String adminDescription,
            @RequestParam(required = false) MultipartFile proofPhoto
    ) throws IOException {

        if (!Set.of("NOT_STARTED", "IN_PROGRESS", "COMPLETED")
                .contains(status)) {
            throw new IllegalArgumentException("Invalid complaint status");
        }

        if ("COMPLETED".equals(status)
                && (adminDescription == null || adminDescription.isBlank())
                && (proofPhoto == null || proofPhoto.isEmpty())) {
            throw new IllegalArgumentException(
                    "Completion description or proof photo is required");
        }

        String image = imageToBase64(proofPhoto);

        return service.updateStatus(
                id, status, adminDescription, image);
    }
}
