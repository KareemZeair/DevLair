package com.devlair.api.scenario;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/scenarios")
public class ScenarioController {

    private final ScenarioService scenarioService;

    public ScenarioController(ScenarioService scenarioService) {
        this.scenarioService = scenarioService;
    }

    @GetMapping
    List<ScenarioApi.Summary> list() {
        return scenarioService.list();
    }

    @GetMapping("/{slug}")
    ScenarioApi.Detail get(@PathVariable String slug) {
        return scenarioService.get(slug);
    }

    @PostMapping("/{slug}/reviews")
    ScenarioApi.ReviewFeedback submitReview(
            @PathVariable String slug, @Valid @RequestBody ScenarioApi.SubmitRequest request, Authentication authentication) {
        return scenarioService.submitReview(slug, authentication.getName(), request);
    }
}
