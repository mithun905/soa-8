
package com.campus.cms.repository;

import com.campus.cms.model.Complaint;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ComplaintRepository extends MongoRepository<Complaint, String> {

    List<Complaint> findByStudentIdOrderByCreatedAtDesc(String studentId);

    List<Complaint> findAllByOrderByCreatedAtDesc();

    List<Complaint> findByStatusOrderByCreatedAtDesc(String status);

}
