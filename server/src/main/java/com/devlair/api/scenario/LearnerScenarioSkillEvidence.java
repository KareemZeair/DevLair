package com.devlair.api.scenario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "learner_scenario_skill_evidence")
public class LearnerScenarioSkillEvidence {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "learner_user_id", nullable = false)
    private UUID learnerUserId;

    @Column(name = "scenario_id", nullable = false)
    private UUID scenarioId;

    @Column(name = "skill_key", nullable = false)
    private String skillKey;

    @Column(name = "best_score", nullable = false)
    private int bestScore;

    @Column(nullable = false)
    private int attempts;

    @Column(name = "last_practiced_at", nullable = false)
    private Instant lastPracticedAt;

    protected LearnerScenarioSkillEvidence() {
    }

    public LearnerScenarioSkillEvidence(UUID learnerUserId, UUID scenarioId, String skillKey, int score, Instant practicedAt) {
        this.learnerUserId = learnerUserId;
        this.scenarioId = scenarioId;
        this.skillKey = skillKey;
        this.bestScore = score;
        this.attempts = 1;
        this.lastPracticedAt = practicedAt;
    }

    public void recordAttempt(int score, Instant practicedAt) {
        bestScore = Math.max(bestScore, score);
        attempts++;
        lastPracticedAt = practicedAt;
    }

    public UUID getScenarioId() { return scenarioId; }
    public String getSkillKey() { return skillKey; }
    public int getBestScore() { return bestScore; }
}
