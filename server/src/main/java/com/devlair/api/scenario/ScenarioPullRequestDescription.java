package com.devlair.api.scenario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "scenario_pr_descriptions")
public class ScenarioPullRequestDescription {
    @Id
    @Column(name = "scenario_id")
    private UUID scenarioId;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String problem;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String solution;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String testing;
    protected ScenarioPullRequestDescription() { }
    public String getProblem() { return problem; }
    public String getSolution() { return solution; }
    public String getTesting() { return testing; }
}
