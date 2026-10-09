package com.devlair.api.scenario;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public final class ScenarioApi {

    private ScenarioApi() {
    }

    public record Summary(String slug, String title, String summary) {
    }

    public record Task(String slug, String title, String summary, String workType, String difficulty,
                          String companyArea, List<String> skills, String status, int attempts, int bestScore) {
    }

    public record SkillEvidence(String skillKey, int bestScore, int completedTasks) {
    }

    public record InboxNotice(String title, String message) {
    }

    public record Workspace(List<Task> tasks, List<SkillEvidence> skills, List<InboxNotice> inbox) {
    }

    public record Document(String type, String title, String content) {
    }

    public record DiffLine(String type, Integer originalLineNumber, Integer proposedLineNumber, String text) {
    }

    public record FileContent(String path, String originalContent, String proposedContent, List<DiffLine> diff) {
    }

    public record ContextFile(String path, String content) { }
    public record PullRequestDescription(String problem, String solution, String testing) { }
    public record Hint(int order, String title, String content) { }

    public record Detail(String slug, String title, String summary, PullRequestDescription pullRequestDescription,
                         List<Document> documents, List<FileContent> files, List<ContextFile> contextFiles, List<Hint> hints) {
    }

    public record CommentRequest(@NotBlank String filePath, @Min(1) int lineNumber, @NotBlank String body) {
    }

    public record SubmitRequest(@NotNull @Valid List<CommentRequest> comments) {
    }

    public record FindingFeedback(String filePath, int startLine, int endLine, String severity, String title, String explanation, String recommendedCode) {
        static FindingFeedback from(ReviewFinding finding) {
            return new FindingFeedback(
                    finding.getFilePath(),
                    finding.getStartLine(),
                    finding.getEndLine(),
                    finding.getSeverity(),
                    finding.getTitle(),
                    finding.getExplanation(),
                    finding.getRecommendedCode());
        }
    }

    public record UnmatchedComment(String filePath, int lineNumber, String body) {
    }

    public record ReviewFeedback(
            List<FindingFeedback> found, List<FindingFeedback> missed, List<UnmatchedComment> unmatchedComments) {
    }
}
