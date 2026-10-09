package com.devlair.api.scenario;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearnerScenarioSkillEvidenceRepository extends JpaRepository<LearnerScenarioSkillEvidence, UUID> {
    Optional<LearnerScenarioSkillEvidence> findByLearnerUserIdAndScenarioIdAndSkillKey(UUID learnerUserId, UUID scenarioId, String skillKey);
    List<LearnerScenarioSkillEvidence> findByLearnerUserId(UUID learnerUserId);
}
