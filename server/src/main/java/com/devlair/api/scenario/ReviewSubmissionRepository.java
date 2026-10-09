package com.devlair.api.scenario;

import java.util.UUID;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewSubmissionRepository extends JpaRepository<ReviewSubmission, UUID> {
    List<ReviewSubmission> findByLearnerUserIdOrderBySubmittedAtDesc(UUID learnerUserId);
}
