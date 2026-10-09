package com.devlair.api.scenario;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScenarioHintRepository extends JpaRepository<ScenarioHint, UUID> {
    List<ScenarioHint> findByScenarioIdOrderByHintOrderAsc(UUID scenarioId);
}
