package com.devlair.api.scenario;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScenarioFileRepository extends JpaRepository<ScenarioFile, UUID> {
    List<ScenarioFile> findByScenarioIdOrderByPathAsc(UUID scenarioId);
}
