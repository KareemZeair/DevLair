package com.devlair.api.scenario;

import com.devlair.api.user.LearnerUser;
import com.devlair.api.user.LearnerUserRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScenarioService {

    private final ScenarioRepository scenarioRepository;
    private final ScenarioDocumentRepository documentRepository;
    private final ScenarioFileRepository fileRepository;
    private final ReviewFindingRepository findingRepository;
    private final ReviewSubmissionRepository submissionRepository;
    private final LearnerUserRepository learnerUserRepository;
    private final ReviewEvaluationService reviewEvaluationService;
    private final LearnerScenarioSkillEvidenceRepository evidenceRepository;
    private final ScenarioPullRequestDescriptionRepository pullRequestDescriptionRepository;
    private final ScenarioHintRepository hintRepository;

    public ScenarioService(
            ScenarioRepository scenarioRepository,
            ScenarioDocumentRepository documentRepository,
            ScenarioFileRepository fileRepository,
            ReviewFindingRepository findingRepository,
            ReviewSubmissionRepository submissionRepository,
            LearnerUserRepository learnerUserRepository,
            ReviewEvaluationService reviewEvaluationService, LearnerScenarioSkillEvidenceRepository evidenceRepository,
            ScenarioPullRequestDescriptionRepository pullRequestDescriptionRepository, ScenarioHintRepository hintRepository) {
        this.scenarioRepository = scenarioRepository;
        this.documentRepository = documentRepository;
        this.fileRepository = fileRepository;
        this.findingRepository = findingRepository;
        this.submissionRepository = submissionRepository;
        this.learnerUserRepository = learnerUserRepository;
        this.reviewEvaluationService = reviewEvaluationService;
        this.evidenceRepository = evidenceRepository;
        this.pullRequestDescriptionRepository = pullRequestDescriptionRepository;
        this.hintRepository = hintRepository;
    }

    @Transactional(readOnly = true)
    public List<ScenarioApi.Summary> list() {
        return scenarioRepository.findAllByOrderByTitleAsc().stream()
                .map(scenario -> new ScenarioApi.Summary(scenario.getSlug(), scenario.getTitle(), scenario.getSummary()))
                .toList();
    }

    @Transactional(readOnly = true)
    public ScenarioApi.Detail get(String slug) {
        Scenario scenario = requireScenario(slug);
        List<ScenarioApi.Document> documents = documentRepository.findByScenarioIdOrderByDocumentTypeAsc(scenario.getId()).stream()
                .map(document -> new ScenarioApi.Document(document.getDocumentType(), document.getTitle(), document.getContent()))
                .toList();
        List<ScenarioFile> storedFiles = fileRepository.findByScenarioIdOrderByPathAsc(scenario.getId());
        List<ScenarioApi.FileContent> files = storedFiles.stream().filter(file -> file.getFileRole().equals("CHANGED"))
                .map(file -> new ScenarioApi.FileContent(
                        file.getPath(),
                        file.getOriginalContent(),
                        file.getProposedContent(),
                        LineDiffer.diff(file.getOriginalContent(), file.getProposedContent()).stream()
                                .map(line -> new ScenarioApi.DiffLine(
                                        line.type().name(),
                                        line.originalLineNumber(),
                                        line.proposedLineNumber(),
                                        line.text()))
                                .toList()))
                .toList();
        List<ScenarioApi.ContextFile> contextFiles = storedFiles.stream().filter(file -> file.getFileRole().equals("CONTEXT"))
                .map(file -> new ScenarioApi.ContextFile(file.getPath(), file.getProposedContent())).toList();
        ScenarioApi.PullRequestDescription description = pullRequestDescriptionRepository.findByScenarioId(scenario.getId())
                .map(value -> new ScenarioApi.PullRequestDescription(value.getProblem(), value.getSolution(), value.getTesting())).orElse(null);
        List<ScenarioApi.Hint> hints = hintRepository.findByScenarioIdOrderByHintOrderAsc(scenario.getId()).stream()
                .map(hint -> new ScenarioApi.Hint(hint.getHintOrder(), hint.getTitle(), hint.getContent())).toList();
        return new ScenarioApi.Detail(scenario.getSlug(), scenario.getTitle(), scenario.getSummary(), description, documents, files, contextFiles, hints);
    }

    @Transactional
    public ScenarioApi.ReviewFeedback submitReview(String slug, String learnerEmail, ScenarioApi.SubmitRequest request) {
        Scenario scenario = requireScenario(slug);
        LearnerUser learner = learnerUserRepository.findByEmail(learnerEmail).orElseThrow();
        ReviewSubmission submission = new ReviewSubmission(learner.getId(), scenario.getId(), Instant.now());
        for (ScenarioApi.CommentRequest comment : request.comments()) {
            submission.addComment(comment.filePath(), comment.lineNumber(), comment.body());
        }
        List<ReviewFinding> findings = findingRepository.findByScenarioId(scenario.getId());
        ScenarioApi.ReviewFeedback feedback = reviewEvaluationService.evaluate(findings, request.comments());
        submissionRepository.save(submission);
        recordSkillEvidence(learner.getId(), scenario.getId(), findings, request.comments());
        return feedback;
    }

    private Scenario requireScenario(String slug) {
        return scenarioRepository.findBySlug(slug).orElseThrow(() -> new ScenarioNotFoundException(slug));
    }

    private void recordSkillEvidence(java.util.UUID learnerId, java.util.UUID scenarioId, List<ReviewFinding> findings,
            List<ScenarioApi.CommentRequest> comments) {
        Instant now = Instant.now();
        findings.stream().collect(java.util.stream.Collectors.groupingBy(ReviewFinding::getSkillKey)).forEach((skill, skillFindings) -> {
            int found = (int) skillFindings.stream()
                    .filter(finding -> comments.stream().anyMatch(comment -> ReviewEvaluationService.matches(finding, comment)))
                    .count();
            int score = (int) Math.round(found * 100.0 / skillFindings.size());
            java.util.Optional<LearnerScenarioSkillEvidence> existing = evidenceRepository
                    .findByLearnerUserIdAndScenarioIdAndSkillKey(learnerId, scenarioId, skill);
            LearnerScenarioSkillEvidence evidence = existing
                    .orElseGet(() -> new LearnerScenarioSkillEvidence(learnerId, scenarioId, skill, score, now));
            existing.ifPresent(value -> value.recordAttempt(score, now));
            evidenceRepository.save(evidence);
        });
    }
}
