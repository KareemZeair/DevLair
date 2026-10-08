package com.devlair.api.scenario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "review_comments")
public class ReviewComment {

    @Id
    @UuidGenerator
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "review_submission_id")
    private ReviewSubmission submission;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "line_number", nullable = false)
    private int lineNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    protected ReviewComment() {
    }

    ReviewComment(ReviewSubmission submission, String filePath, int lineNumber, String body) {
        this.submission = submission;
        this.filePath = filePath;
        this.lineNumber = lineNumber;
        this.body = body;
    }

    public String getFilePath() {
        return filePath;
    }

    public int getLineNumber() {
        return lineNumber;
    }

    public String getBody() {
        return body;
    }
}
