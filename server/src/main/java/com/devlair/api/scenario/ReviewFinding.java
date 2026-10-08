package com.devlair.api.scenario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "review_findings")
public class ReviewFinding {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "scenario_id", nullable = false)
    private UUID scenarioId;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "start_line", nullable = false)
    private int startLine;

    @Column(name = "end_line", nullable = false)
    private int endLine;

    @Column(nullable = false, length = 20)
    private String severity;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String explanation;

    protected ReviewFinding() {
    }

    public ReviewFinding(UUID scenarioId, String filePath, int startLine, int endLine, String severity, String title, String explanation) {
        this.scenarioId = scenarioId;
        this.filePath = filePath;
        this.startLine = startLine;
        this.endLine = endLine;
        this.severity = severity;
        this.title = title;
        this.explanation = explanation;
    }

    public String getFilePath() {
        return filePath;
    }

    public int getStartLine() {
        return startLine;
    }

    public int getEndLine() {
        return endLine;
    }

    public String getSeverity() {
        return severity;
    }

    public String getTitle() {
        return title;
    }

    public String getExplanation() {
        return explanation;
    }
}
