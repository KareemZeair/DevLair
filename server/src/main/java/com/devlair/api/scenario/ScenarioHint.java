package com.devlair.api.scenario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "scenario_hints")
public class ScenarioHint {
    @Id private UUID id;
    @Column(name = "scenario_id", nullable = false) private UUID scenarioId;
    @Column(name = "hint_order", nullable = false) private int hintOrder;
    @Column(nullable = false) private String title;
    @Column(nullable = false, columnDefinition = "TEXT") private String content;
    protected ScenarioHint() { }
    public int getHintOrder() { return hintOrder; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
}
