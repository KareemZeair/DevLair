package com.devlair.api.scenario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "scenario_files")
public class ScenarioFile {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "scenario_id", nullable = false)
    private UUID scenarioId;

    @Column(nullable = false, length = 500)
    private String path;

    @Column(name = "original_content", nullable = false, columnDefinition = "TEXT")
    private String originalContent;

    @Column(name = "proposed_content", nullable = false, columnDefinition = "TEXT")
    private String proposedContent;

    protected ScenarioFile() {
    }

    public ScenarioFile(UUID scenarioId, String path, String originalContent, String proposedContent) {
        this.scenarioId = scenarioId;
        this.path = path;
        this.originalContent = originalContent;
        this.proposedContent = proposedContent;
    }

    public String getPath() {
        return path;
    }

    public String getOriginalContent() {
        return originalContent;
    }

    public String getProposedContent() {
        return proposedContent;
    }
}
