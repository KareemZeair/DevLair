package com.devlair.api.scenario;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewSubmissionRepository extends JpaRepository<ReviewSubmission, UUID> {
}
