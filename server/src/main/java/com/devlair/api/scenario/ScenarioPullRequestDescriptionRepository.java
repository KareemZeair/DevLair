package com.devlair.api.scenario;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScenarioPullRequestDescriptionRepository extends JpaRepository<ScenarioPullRequestDescription, UUID> {
    Optional<ScenarioPullRequestDescription> findByScenarioId(UUID scenarioId);
}
