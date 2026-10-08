package com.devlair.api.scenario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "scenario_documents")
public class ScenarioDocument {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "scenario_id", nullable = false)
    private UUID scenarioId;

    @Column(name = "document_type", nullable = false, length = 40)
    private String documentType;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    protected ScenarioDocument() {
    }

    public ScenarioDocument(UUID scenarioId, String documentType, String title, String content) {
        this.scenarioId = scenarioId;
        this.documentType = documentType;
        this.title = title;
        this.content = content;
    }

    public String getDocumentType() {
        return documentType;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }
}
