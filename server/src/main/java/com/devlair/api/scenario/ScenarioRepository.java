package com.devlair.api.scenario;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScenarioRepository extends JpaRepository<Scenario, UUID> {
    Optional<Scenario> findBySlug(String slug);

    List<Scenario> findAllByOrderByTitleAsc();
}
