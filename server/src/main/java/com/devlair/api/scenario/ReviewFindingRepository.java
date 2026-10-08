package com.devlair.api.scenario;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewFindingRepository extends JpaRepository<ReviewFinding, UUID> {
    List<ReviewFinding> findByScenarioId(UUID scenarioId);
}
