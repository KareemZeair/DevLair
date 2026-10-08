package com.devlair.api.scenario;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class ReviewEvaluationServiceTest {

    private final ReviewEvaluationService evaluationService = new ReviewEvaluationService();

    @Test
    void treatsOverlappingFileAndLineCommentsAsFound() {
        ReviewFinding ownership = finding("src/OrderService.java", 13, 15, "Missing customer scope");
        ReviewFinding tests = finding("src/OrderServiceTest.java", 10, 19, "Weak test");
        List<ScenarioApi.CommentRequest> comments = List.of(
                new ScenarioApi.CommentRequest("src/OrderService.java", 14, "This can leak another customer's order."),
                new ScenarioApi.CommentRequest("src/Unrelated.java", 3, "Style nit"));

        ScenarioApi.ReviewFeedback feedback = evaluationService.evaluate(List.of(ownership, tests), comments);

        assertThat(feedback.found()).extracting(ScenarioApi.FindingFeedback::title).containsExactly("Missing customer scope");
        assertThat(feedback.missed()).extracting(ScenarioApi.FindingFeedback::title).containsExactly("Weak test");
        assertThat(feedback.unmatchedComments()).extracting(ScenarioApi.UnmatchedComment::filePath).containsExactly("src/Unrelated.java");
    }

    private static ReviewFinding finding(String path, int start, int end, String title) {
        return new ReviewFinding(UUID.randomUUID(), path, start, end, "HIGH", title, "explanation");
    }
}
