package com.devlair.api.scenario;

import com.devlair.api.user.LearnerUser;
import com.devlair.api.user.LearnerUserRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkspaceService {

    private final ScenarioRepository scenarioRepository;
    private final ReviewFindingRepository findingRepository;
    private final ReviewSubmissionRepository submissionRepository;
    private final LearnerScenarioSkillEvidenceRepository evidenceRepository;
    private final LearnerUserRepository learnerUserRepository;

    public WorkspaceService(ScenarioRepository scenarioRepository, ReviewFindingRepository findingRepository,
            ReviewSubmissionRepository submissionRepository, LearnerScenarioSkillEvidenceRepository evidenceRepository,
            LearnerUserRepository learnerUserRepository) {
        this.scenarioRepository = scenarioRepository;
        this.findingRepository = findingRepository;
        this.submissionRepository = submissionRepository;
        this.evidenceRepository = evidenceRepository;
        this.learnerUserRepository = learnerUserRepository;
    }

    @Transactional(readOnly = true)
    public ScenarioApi.Workspace get(String learnerEmail) {
        LearnerUser learner = learnerUserRepository.findByEmail(learnerEmail).orElseThrow();
        UUID learnerId = learner.getId();
        Map<UUID, Long> attemptsByScenario = submissionRepository.findByLearnerUserIdOrderBySubmittedAtDesc(learnerId).stream()
                .collect(Collectors.groupingBy(ReviewSubmission::getScenarioId, Collectors.counting()));
        Map<UUID, List<LearnerScenarioSkillEvidence>> evidenceByScenario = evidenceRepository.findByLearnerUserId(learnerId).stream()
                .collect(Collectors.groupingBy(LearnerScenarioSkillEvidence::getScenarioId));

        List<ScenarioApi.Task> tasks = scenarioRepository.findAllByOrderByTitleAsc().stream()
                .map(scenario -> toTask(scenario, attemptsByScenario, evidenceByScenario))
                .toList();
        List<ScenarioApi.SkillEvidence> skills = evidenceRepository.findByLearnerUserId(learnerId).stream()
                .collect(Collectors.groupingBy(LearnerScenarioSkillEvidence::getSkillKey))
                .entrySet().stream()
                .map(entry -> new ScenarioApi.SkillEvidence(
                        entry.getKey(),
                        (int) Math.round(entry.getValue().stream().mapToInt(LearnerScenarioSkillEvidence::getBestScore).average().orElse(0)),
                        entry.getValue().size()))
                .sorted(Comparator.comparing(ScenarioApi.SkillEvidence::skillKey))
                .toList();

        List<ScenarioApi.InboxNotice> inbox = tasks.stream().anyMatch(task -> task.status().equals("COMPLETED"))
                ? List.of(new ScenarioApi.InboxNotice("New pull request ready", "Your review was submitted. Another pull request is ready when you are."))
                : List.of(new ScenarioApi.InboxNotice("Welcome to engineering", "Your first pull request is ready. Review the ticket, architecture note, and proposed code."));
        return new ScenarioApi.Workspace(tasks, skills, inbox);
    }

    private ScenarioApi.Task toTask(Scenario scenario, Map<UUID, Long> attemptsByScenario,
            Map<UUID, List<LearnerScenarioSkillEvidence>> evidenceByScenario) {
        List<ReviewFinding> findings = findingRepository.findByScenarioId(scenario.getId());
        List<LearnerScenarioSkillEvidence> evidence = evidenceByScenario.getOrDefault(scenario.getId(), List.of());
        long attempts = attemptsByScenario.getOrDefault(scenario.getId(), 0L);
        int bestScore = (int) Math.round(evidence.stream().mapToInt(LearnerScenarioSkillEvidence::getBestScore).average().orElse(0));
        return new ScenarioApi.Task(scenario.getSlug(), scenario.getTitle(), scenario.getSummary(), scenario.getWorkType(),
                scenario.getDifficulty(), scenario.getCompanyArea(), findings.stream().map(ReviewFinding::getSkillKey).distinct().sorted().toList(),
                attempts > 0 ? "COMPLETED" : "AVAILABLE", Math.toIntExact(attempts), bestScore);
    }
}
