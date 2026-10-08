package com.devlair.api.scenario;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScenarioDocumentRepository extends JpaRepository<ScenarioDocument, UUID> {
    List<ScenarioDocument> findByScenarioIdOrderByDocumentTypeAsc(UUID scenarioId);
}
