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

    public ScenarioService(
            ScenarioRepository scenarioRepository,
            ScenarioDocumentRepository documentRepository,
            ScenarioFileRepository fileRepository,
            ReviewFindingRepository findingRepository,
            ReviewSubmissionRepository submissionRepository,
            LearnerUserRepository learnerUserRepository,
            ReviewEvaluationService reviewEvaluationService) {
        this.scenarioRepository = scenarioRepository;
        this.documentRepository = documentRepository;
        this.fileRepository = fileRepository;
        this.findingRepository = findingRepository;
        this.submissionRepository = submissionRepository;
        this.learnerUserRepository = learnerUserRepository;
        this.reviewEvaluationService = reviewEvaluationService;
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
        List<ScenarioApi.FileContent> files = fileRepository.findByScenarioIdOrderByPathAsc(scenario.getId()).stream()
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
        return new ScenarioApi.Detail(scenario.getSlug(), scenario.getTitle(), scenario.getSummary(), documents, files);
    }

    @Transactional
    public ScenarioApi.ReviewFeedback submitReview(String slug, String learnerEmail, ScenarioApi.SubmitRequest request) {
        Scenario scenario = requireScenario(slug);
        LearnerUser learner = learnerUserRepository.findByEmail(learnerEmail).orElseThrow();
        ReviewSubmission submission = new ReviewSubmission(learner.getId(), scenario.getId(), Instant.now());
        for (ScenarioApi.CommentRequest comment : request.comments()) {
            submission.addComment(comment.filePath(), comment.lineNumber(), comment.body());
        }
        submissionRepository.save(submission);

        List<ReviewFinding> findings = findingRepository.findByScenarioId(scenario.getId());
        return reviewEvaluationService.evaluate(findings, request.comments());
    }

    private Scenario requireScenario(String slug) {
        return scenarioRepository.findBySlug(slug).orElseThrow(() -> new ScenarioNotFoundException(slug));
    }
}
