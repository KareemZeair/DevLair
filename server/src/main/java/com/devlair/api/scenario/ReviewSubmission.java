package com.devlair.api.scenario;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "review_submissions")
public class ReviewSubmission {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "learner_user_id", nullable = false)
    private UUID learnerUserId;

    @Column(name = "scenario_id", nullable = false)
    private UUID scenarioId;

    @Column(name = "submitted_at", nullable = false)
    private Instant submittedAt;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewComment> comments = new ArrayList<>();

    protected ReviewSubmission() {
    }

    public ReviewSubmission(UUID learnerUserId, UUID scenarioId, Instant submittedAt) {
        this.learnerUserId = learnerUserId;
        this.scenarioId = scenarioId;
        this.submittedAt = submittedAt;
    }

    public void addComment(String filePath, int lineNumber, String body) {
        ReviewComment comment = new ReviewComment(this, filePath, lineNumber, body);
        comments.add(comment);
    }

    public List<ReviewComment> getComments() {
        return comments;
    }

    public UUID getScenarioId() { return scenarioId; }
    public Instant getSubmittedAt() { return submittedAt; }
}
