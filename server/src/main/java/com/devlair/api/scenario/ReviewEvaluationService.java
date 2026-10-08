package com.devlair.api.scenario;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * Compares learner comments to seeded findings by file path and line range.
 * This is the ground truth for the first trainer: AI does not decide whether
 * an issue exists.
 */
@Service
public class ReviewEvaluationService {

    public ScenarioApi.ReviewFeedback evaluate(List<ReviewFinding> findings, List<ScenarioApi.CommentRequest> comments) {
        List<ScenarioApi.FindingFeedback> found = new ArrayList<>();
        List<ScenarioApi.FindingFeedback> missed = new ArrayList<>();
        for (ReviewFinding finding : findings) {
            boolean matched = comments.stream().anyMatch(comment -> matches(finding, comment));
            if (matched) {
                found.add(ScenarioApi.FindingFeedback.from(finding));
            } else {
                missed.add(ScenarioApi.FindingFeedback.from(finding));
            }
        }

        List<ScenarioApi.UnmatchedComment> unmatched = comments.stream()
                .filter(comment -> findings.stream().noneMatch(finding -> matches(finding, comment)))
                .map(comment -> new ScenarioApi.UnmatchedComment(comment.filePath(), comment.lineNumber(), comment.body()))
                .toList();

        return new ScenarioApi.ReviewFeedback(List.copyOf(found), List.copyOf(missed), unmatched);
    }

    static boolean matches(ReviewFinding finding, ScenarioApi.CommentRequest comment) {
        return finding.getFilePath().equals(comment.filePath())
                && comment.lineNumber() >= finding.getStartLine()
                && comment.lineNumber() <= finding.getEndLine();
    }
}
