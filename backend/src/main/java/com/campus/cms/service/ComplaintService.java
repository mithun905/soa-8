
package com.campus.cms.service;

import com.campus.cms.model.Complaint;
import com.campus.cms.model.User;
import com.campus.cms.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ComplaintService {

    private final ComplaintRepository repository;

    public ComplaintService(ComplaintRepository repository) {
        this.repository = repository;
    }

    public Complaint createComplaint(
            User student,
            String category,
            String description,
            String photo) {

        Complaint complaint = new Complaint();

        complaint.setStudentId(student.getId());
        complaint.setStudentName(student.getName());
        complaint.setRollNumber(student.getRollNumber());
        complaint.setCategory(category);
        complaint.setDescription(description);
        complaint.setPhoto(photo);
        complaint.setStatus("NOT_STARTED");

        complaint.setCreatedAt(Instant.now());
        complaint.setUpdatedAt(Instant.now());

        return repository.save(complaint);
    }

    public List<Complaint> getStudentComplaints(String studentId) {
        return repository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    public List<Complaint> getAllComplaints() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public Complaint updateStatus(
            String id,
            String status,
            String adminDescription,
            String proofPhoto) {

        Complaint complaint = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Complaint not found"));

        complaint.setStatus(status);

        // Preserve previous description if no new description is provided
        if (adminDescription != null && !adminDescription.isBlank()) {
            complaint.setAdminDescription(adminDescription.trim());
        }

        // Preserve previous proof photo if no new photo is uploaded
        if (proofPhoto != null && !proofPhoto.isBlank()) {
            complaint.setProofPhoto(proofPhoto);
        }

        complaint.setUpdatedAt(Instant.now());

        return repository.save(complaint);
    }
}
