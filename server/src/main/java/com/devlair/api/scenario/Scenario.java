package com.devlair.api.scenario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "scenarios")
public class Scenario {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 500)
    private String summary;

    @Column(name = "work_type", nullable = false)
    private String workType;

    @Column(nullable = false)
    private String difficulty;

    @Column(name = "company_area", nullable = false)
    private String companyArea;

    protected Scenario() {
    }

    public Scenario(String slug, String title, String summary) {
        this.slug = slug;
        this.title = title;
        this.summary = summary;
        this.workType = "PR_REVIEW";
        this.difficulty = "FOUNDATION";
        this.companyArea = "Order operations";
    }

    public UUID getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public String getTitle() {
        return title;
    }

    public String getSummary() {
        return summary;
    }

    public String getWorkType() { return workType; }
    public String getDifficulty() { return difficulty; }
    public String getCompanyArea() { return companyArea; }
}
